import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: 'https://insforge.alienwatermcbo.com',
  anonKey: 'ik_449c6ad841607ca640cc6c61acc8d2ce1549bc578c2d38796a77734abeec08e6'
});

async function main() {
  try {
    // 1. Query Historial for reference 3830
    const { data: histRef, error: err1 } = await client.database
      .from('historial')
      .select('*')
      .eq('empleado', '3830');
    console.log('--- HISTORIAL FOR REF 3830 ---');
    console.log('Data:', histRef);
    console.log('Error:', err1);

    // 2. Query User profile +584146602325
    const { data: userProfile, error: err2 } = await client.database
      .from('users')
      .select('*')
      .eq('phone', '+584146602325');
    console.log('\n--- USER PROFILE ---');
    console.log('Data:', userProfile);
    console.log('Error:', err2);

    // 3. Query Creditos for user +584146602325
    const { data: credits, error: err3 } = await client.database
      .from('creditos')
      .select('*')
      .eq('phone', '+584146602325');
    console.log('\n--- CREDITS ---');
    console.log('Data:', credits);
    console.log('Error:', err3);

    // 4. Query Sucursal 108
    const { data: sucursal, error: err4 } = await client.database
      .from('sucursales')
      .select('*')
      .eq('codigo', '108');
    console.log('\n--- SUCURSAL 108 ---');
    console.log('Data:', sucursal);
    console.log('Error:', err4);
    
    // 5. Query all Historial for RECARGA to see what references are there
    const { data: allRecharges, error: err5 } = await client.database
      .from('historial')
      .select('qr_code, cantidad, empleado, sucursal, fecha')
      .eq('accion', 'RECARGA')
      .limit(10);
    console.log('\n--- RECENT RECHARGES ---');
    console.log('Data:', allRecharges);
    console.log('Error:', err5);

  } catch (err) {
    console.error("Caught error:", err);
  }
}

main();
