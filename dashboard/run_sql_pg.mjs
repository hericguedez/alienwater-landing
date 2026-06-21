import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:85cvLDt6vyf51izBfzwoe@insforge.alienwatermcbo.com:5432/insforge'
});

async function main() {
  try {
    await client.connect();
    console.log('Successfully connected to database!');
    
    // 1. Delete the test recharge from historial
    const deleteHist = await client.query(`
      DELETE FROM public.historial WHERE empleado = '3830';
    `);
    console.log('Deleted from historial:', deleteHist.rowCount);
    
    // 2. Reset QR code RECARGA-00002
    const resetCred = await client.query(`
      UPDATE public.creditos 
      SET phone = NULL, saldo = 0, assigned_at = NULL 
      WHERE qr_code = 'RECARGA-00002';
    `);
    console.log('Reset creditos:', resetCred.rowCount);
    
    // 3. Reset user profile sucursal temporal to '108'
    const resetUser = await client.query(`
      UPDATE public.users 
      SET sucursal = '108' 
      WHERE phone = '+584146602325';
    `);
    console.log('Reset user temporal sucursal:', resetUser.rowCount);
    
  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await client.end();
  }
}

main();
