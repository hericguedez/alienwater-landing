import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: 'https://insforge.alienwatermcbo.com',
  anonKey: 'ik_449c6ad841607ca640cc6c61acc8d2ce1549bc578c2d38796a77734abeec08e6'
});

async function main() {
  try {
    console.log('Executing registrar_pago test query...');
    // We can call database.rpc() to call the registrar_pago Postgres function directly!
    const { data, error } = await client.database.rpc('registrar_pago', {
      p_phone: '+584146602325',
      p_first_name: 'Heric',
      p_last_name: '',
      p_ref: '3830',
      p_amount: 55,
      p_sucursal: '108'
    });

    console.log('--- RPC RESULT ---');
    console.log('Data:', data);
    console.log('Error:', error);
  } catch (err) {
    console.error('Exception caught:', err);
  }
}

main();
