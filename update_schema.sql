-- ═══════════════════════════════════════════
-- MIGRACIÓN: Optimización de Sucursales y Perfiles
-- Ejecutar en el SQL Editor de InsForge
-- ═══════════════════════════════════════════

-- 1. Actualización de la Tabla de Sucursales
-- Agregar nuevas columnas independientes de nombre y apellido
ALTER TABLE public.sucursales 
ADD COLUMN IF NOT EXISTS responsable_nombre VARCHAR(150),
ADD COLUMN IF NOT EXISTS responsable_apellido VARCHAR(150);

-- Migrar datos de la columna responsable anterior si existen
UPDATE public.sucursales 
SET 
  responsable_nombre = CASE 
    WHEN responsable IS NOT NULL AND position(' ' in responsable) > 0 THEN split_part(responsable, ' ', 1) 
    WHEN responsable IS NOT NULL THEN responsable 
    ELSE 'Responsable' 
  END,
  responsable_apellido = CASE 
    WHEN responsable IS NOT NULL AND position(' ' in responsable) > 0 THEN substring(responsable from position(' ' in responsable) + 1) 
    ELSE 'Apellido' 
  END
WHERE responsable_nombre IS NULL OR responsable_nombre = '';

-- Rellenar valores por defecto para evitar fallos de restricciones NOT NULL en registros incompletos
UPDATE public.sucursales 
SET
  ciudad = COALESCE(ciudad, 'Maracaibo'),
  direccion = COALESCE(direccion, 'Calle Principal'),
  telefono = COALESCE(telefono, '04120000000'),
  email = COALESCE(email, 'sucursal@alienwater.com');

-- Aplicar restricciones de obligatoriedad (NOT NULL)
ALTER TABLE public.sucursales ALTER COLUMN ciudad SET NOT NULL;
ALTER TABLE public.sucursales ALTER COLUMN direccion SET NOT NULL;
ALTER TABLE public.sucursales ALTER COLUMN responsable_nombre SET NOT NULL;
ALTER TABLE public.sucursales ALTER COLUMN responsable_apellido SET NOT NULL;
ALTER TABLE public.sucursales ALTER COLUMN telefono SET NOT NULL;
ALTER TABLE public.sucursales ALTER COLUMN email SET NOT NULL;

-- Eliminar columna responsable antigua (si existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sucursales' AND column_name='responsable') THEN
    ALTER TABLE public.sucursales DROP COLUMN responsable;
  END IF;
END $$;


-- 2. Actualización de la Tabla de Usuarios del Dashboard (Perfiles)
-- Agregar columnas para datos personales y configuración de Pago Móvil
ALTER TABLE public.dashboard_users
ADD COLUMN IF NOT EXISTS ciudad VARCHAR(100),
ADD COLUMN IF NOT EXISTS direccion TEXT,
ADD COLUMN IF NOT EXISTS telefono VARCHAR(30),
ADD COLUMN IF NOT EXISTS pm_telefono VARCHAR(15),
ADD COLUMN IF NOT EXISTS pm_cedula VARCHAR(20),
ADD COLUMN IF NOT EXISTS pm_banco VARCHAR(100);
