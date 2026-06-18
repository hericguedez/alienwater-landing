// Direct postgres connection via supabase-js createClient and .rpc
import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: 'https://insforge.alienwatermcbo.com',
  anonKey: 'ik_449c6ad841607ca640cc6c61acc8d2ce1549bc578c2d38796a77734abeec08e6'
});

async function run() {
  // Try to create a helper function first, then call it
  // Alternative: try creating the table via the database schema endpoint
  
  // Let's try the Supabase management API endpoint
  const mgmtEndpoints = [
    '/rest/v1/',
    '/auth/v1/',
  ];
  
  // The simplest approach: create a PostgreSQL function that creates the table, then call it
  // But we need DDL access. Let's check if there's a service role key.
  
  // For now, let's write the migration SQL to a file and instruct the user
  // BUT first, let's check if the table can be created via fetch to the management API
  
  const headers = {
    'Content-Type': 'application/json',
    'apikey': 'ik_449c6ad841607ca640cc6c61acc8d2ce1549bc578c2d38796a77734abeec08e6',
    'Authorization': 'Bearer ik_449c6ad841607ca640cc6c61acc8d2ce1549bc578c2d38796a77734abeec08e6'
  };
  
  // Try Supabase SQL endpoint
  const sqlEndpoints = [
    'https://insforge.alienwatermcbo.com/rest/v1/rpc/',
  ];
  
  // Let's try to see if the table already exists (maybe user created it manually)
  const { data, error } = await client.database.from('sucursales').select('*').limit(1);
  if (!error) {
    console.log('✅ Table sucursales already exists!');
    console.log('Data:', JSON.stringify(data));
    return;
  }
  
  if (error.message.includes('does not exist')) {
    console.log('Table does not exist. Writing SQL migration file...');
    
    // Write SQL file for manual execution
    const fs = await import('fs');
    const sql = `-- Run this SQL in your InsForge/Supabase SQL Editor
-- URL: https://insforge.alienwatermcbo.com (Studio > SQL Editor)

CREATE TABLE IF NOT EXISTS public.sucursales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre_negocio VARCHAR(150),
    direccion TEXT,
    responsable VARCHAR(150),
    telefono VARCHAR(30),
    ciudad VARCHAR(100),
    tipo_maquina VARCHAR(30) DEFAULT 'moneda',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Seed with existing branch
INSERT INTO public.sucursales (codigo, nombre_negocio, ciudad, tipo_maquina)
VALUES ('100', 'Sucursal Principal', 'Maracaibo', 'moneda_qr')
ON CONFLICT (codigo) DO NOTHING;

-- Grant access to API roles
GRANT ALL ON public.sucursales TO anon;
GRANT ALL ON public.sucursales TO authenticated;
`;
    fs.writeFileSync('../create_sucursales.sql', sql);
    console.log('✅ SQL file written to: create_sucursales.sql');
    console.log('Please run this SQL in your database admin panel.');
  }
}

run();
