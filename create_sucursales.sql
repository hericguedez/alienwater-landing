-- ═══════════════════════════════════════════
-- MIGRACIÓN: Tabla sucursales + columnas auth
-- Ejecutar en el SQL Editor de InsForge
-- ═══════════════════════════════════════════

-- 1. Tabla de Sucursales
CREATE TABLE IF NOT EXISTS public.sucursales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre_negocio VARCHAR(150),
    direccion TEXT,
    responsable VARCHAR(150),
    telefono VARCHAR(30),
    email VARCHAR(150),
    ciudad VARCHAR(100),
    tipo_maquina VARCHAR(30) DEFAULT 'moneda',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Seed sucursal existente
INSERT INTO public.sucursales (codigo, nombre_negocio, ciudad, tipo_maquina)
VALUES ('100', 'Sucursal Principal', 'Maracaibo', 'moneda_qr')
ON CONFLICT (codigo) DO NOTHING;

-- 2. Agregar columna setup_token a dashboard_users (para setup y reset de contraseña)
ALTER TABLE public.dashboard_users
ADD COLUMN IF NOT EXISTS setup_token UUID DEFAULT NULL,
ADD COLUMN IF NOT EXISTS token_expires TIMESTAMPTZ DEFAULT NULL;

-- 3. Permisos de acceso vía API
GRANT ALL ON public.sucursales TO anon;
GRANT ALL ON public.sucursales TO authenticated;
