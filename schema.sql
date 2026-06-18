-- Habilitar extensión uuid-ossp si no está activa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Usuarios/Clientes
CREATE TABLE IF NOT EXISTS public.users (
    phone VARCHAR(20) PRIMARY KEY, -- ID Primaria: número de teléfono del usuario
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    qr_code_token UUID UNIQUE DEFAULT gen_random_uuid(), -- Token único seguro para el QR
    balance DECIMAL(10, 2) DEFAULT 0.00, -- Saldo actual del usuario (en dinero o litros)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pagos/Recargas (Auditoría de ingresos)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) REFERENCES public.users(phone) ON DELETE CASCADE,
    payment_reference VARCHAR(100) UNIQUE NOT NULL, -- Evita fraudes de doble uso
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Dispensado (Auditoría de consumos de agua)
CREATE TABLE IF NOT EXISTS public.dispenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) REFERENCES public.users(phone) ON DELETE CASCADE,
    machine_id VARCHAR(50) NOT NULL, -- ID de la máquina física
    volume_liters DECIMAL(6, 2) NOT NULL, -- Litros dispensados
    amount_deducted DECIMAL(10, 2) NOT NULL, -- Saldo descontado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de búsqueda para optimizar velocidad de respuesta
CREATE INDEX IF NOT EXISTS idx_users_qr_token ON public.users(qr_code_token);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments(payment_reference);
