-- Habilitar extensión uuid-ossp si no está activa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de Usuarios (Perfiles)
CREATE TABLE IF NOT EXISTS public.users (
    phone VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    sucursal VARCHAR(50), -- Sucursal temporal para flujo de recarga / registro
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de Créditos (Asociados a los usuarios)
CREATE TABLE IF NOT EXISTS public.creditos (
    qr_code VARCHAR(100) PRIMARY KEY, -- Ej: RECARGA-00001
    saldo INT DEFAULT 0,              -- Saldo en Bs / Créditos
    phone VARCHAR(20) UNIQUE REFERENCES public.users(phone) ON DELETE SET NULL, -- Teléfono asociado
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    sucursal VARCHAR(50) -- Sucursal a la que pertenece permanentemente este código QR
);

-- Crear tabla de Historial (Auditoría de movimientos)
CREATE TABLE IF NOT EXISTS public.historial (
    id SERIAL PRIMARY KEY,
    qr_code VARCHAR(100) REFERENCES public.creditos(qr_code) ON DELETE CASCADE,
    accion VARCHAR(50) NOT NULL,       -- 'RECARGA', 'DEBITO', 'USO'
    cantidad INT NOT NULL,             -- Monto sumado o restado
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    empleado VARCHAR(100) DEFAULT NULL, -- Usamos este campo para guardar la referencia de pago móvil
    sucursal VARCHAR(50) -- Sucursal donde ocurrió la transacción
);

-- Crear tabla de Reporte de Ventas
CREATE TABLE IF NOT EXISTS public.reporte_ventas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    monto_bs DOUBLE PRECISION DEFAULT 0.0,
    litros DOUBLE PRECISION DEFAULT 0.0,
    metodo VARCHAR(50) DEFAULT 'EFECTIVO',
    sucursal VARCHAR(50) -- Sucursal donde ocurrió la venta
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_creditos_phone ON public.creditos(phone);
CREATE INDEX IF NOT EXISTS idx_historial_qr ON public.historial(qr_code);

-- Insertar los primeros 10,000 códigos QR (RECARGA-00001 a RECARGA-10000)
-- Por defecto se asignan a la sucursal '100' (Principal)
INSERT INTO public.creditos (qr_code, saldo, phone, assigned_at, sucursal)
SELECT 
    'RECARGA-' || lpad(i::text, 5, '0'), 
    0, 
    NULL, 
    NULL,
    '100'
FROM generate_series(1, 10000) i
ON CONFLICT (qr_code) DO NOTHING;

-- Función PL/pgSQL para registrar el pago móvil, crear perfil de usuario e integrar código QR
CREATE OR REPLACE FUNCTION public.registrar_pago(
    p_phone VARCHAR,
    p_first_name VARCHAR,
    p_last_name VARCHAR,
    p_ref VARCHAR,
    p_amount INT,
    p_sucursal VARCHAR
) 
RETURNS TABLE (
    qr_code_token VARCHAR(100),
    balance INT,
    payment_inserted BOOLEAN
) AS $$
DECLARE
    v_qr_code VARCHAR(100);
    v_sucursal VARCHAR(100);
BEGIN
    -- 1. Verificar si la referencia de pago ya existe en el historial
    IF EXISTS (SELECT 1 FROM public.historial WHERE empleado = p_ref AND accion = 'RECARGA') THEN
        -- Si ya existe, retornamos con payment_inserted = FALSE
        RETURN QUERY SELECT 
            c.qr_code, 
            c.saldo, 
            FALSE::BOOLEAN
        FROM public.creditos c 
        WHERE c.phone = p_phone;
        RETURN;
    END IF;

    -- Inicializar sucursal de la transacción
    v_sucursal := p_sucursal;

    -- 2. Crear o actualizar el perfil del usuario, limpiando el estado de la sucursal temporal
    INSERT INTO public.users (phone, first_name, last_name, sucursal)
    VALUES (p_phone, p_first_name, p_last_name, NULL)
    ON CONFLICT (phone) 
    DO UPDATE SET 
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        sucursal = NULL,
        updated_at = CURRENT_TIMESTAMP;

    -- 3. Buscar si el usuario ya tiene un QR asignado
    SELECT c.qr_code INTO v_qr_code FROM public.creditos c WHERE c.phone = p_phone;

    -- 4. Si no tiene QR asignado (primer pago)
    IF v_qr_code IS NULL THEN
        -- Buscar el primer QR libre que corresponda a esta sucursal específica
        SELECT c.qr_code INTO v_qr_code 
        FROM public.creditos c 
        WHERE c.phone IS NULL AND c.sucursal = v_sucursal
        ORDER BY c.qr_code ASC 
        LIMIT 1 
        FOR UPDATE;
        
        IF v_qr_code IS NULL THEN
            RAISE EXCEPTION 'No hay códigos QR disponibles para la sucursal %', v_sucursal;
        END IF;
        
        -- Asignar el QR al teléfono con el saldo inicial
        UPDATE public.creditos 
        SET phone = p_phone, saldo = p_amount, assigned_at = CURRENT_TIMESTAMP 
        WHERE qr_code = v_qr_code;
    ELSE
        -- Si ya tiene QR, obtener la sucursal asociada a ese QR si v_sucursal no viene especificada
        IF v_sucursal IS NULL OR v_sucursal = '' THEN
            SELECT c.sucursal INTO v_sucursal FROM public.creditos c WHERE c.qr_code = v_qr_code;
        END IF;

        -- Si ya tiene QR, actualizar el saldo sumándolo
        UPDATE public.creditos 
        SET saldo = saldo + p_amount 
        WHERE qr_code = v_qr_code;
    END IF;

    -- 5. Registrar en el historial con la sucursal activa de la transacción
    INSERT INTO public.historial (qr_code, accion, cantidad, empleado, sucursal) 
    VALUES (v_qr_code, 'RECARGA', p_amount, p_ref, v_sucursal);
    
    -- 6. Retornar el QR, saldo actualizado y estado de éxito
    RETURN QUERY SELECT 
        c.qr_code, 
        c.saldo, 
        TRUE::BOOLEAN
    FROM public.creditos c 
    WHERE c.qr_code = v_qr_code;
END;
$$ LANGUAGE plpgsql;

-- Crear Vista para reporte diario de ventas
CREATE OR REPLACE VIEW public.reporte_diario AS
SELECT
  date_trunc('day'::text, created_at)::date AS fecha,
  COUNT(id) AS cantidad_servicios,
  SUM(litros) AS total_litros,
  SUM(monto_bs) AS total_bolivares
FROM
  public.reporte_ventas
GROUP BY
  (date_trunc('day'::text, created_at)::date)
ORDER BY
  (date_trunc('day'::text, created_at)::date) DESC;

-- Función para verificar login en el dashboard
CREATE OR REPLACE FUNCTION public.verificar_login(p_correo VARCHAR, p_contrasena VARCHAR)
RETURNS TABLE (
    success BOOLEAN,
    user_id UUID,
    user_correo VARCHAR,
    user_nombre VARCHAR,
    user_apellido VARCHAR,
    user_sucursal VARCHAR,
    user_rol VARCHAR
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        TRUE::BOOLEAN,
        u.id,
        u.correo,
        u.nombre,
        u.apellido,
        u.sucursal,
        u.rol
    FROM public.dashboard_users u
    WHERE u.correo = p_correo AND u.contrasena = crypt(p_contrasena, u.contrasena);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


