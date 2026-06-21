import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: 'https://insforge.alienwatermcbo.com',
  anonKey: 'ik_449c6ad841607ca640cc6c61acc8d2ce1549bc578c2d38796a77734abeec08e6'
});

async function main() {
  try {
    console.log('1. Checking if sucursal 108 exists...');
    const { data: existingSuc, error: checkErr } = await client.database
      .from('sucursales')
      .select('*')
      .eq('codigo', '108');
      
    if (checkErr) {
      console.error('Error checking sucursal:', checkErr);
      return;
    }
    
    if (existingSuc.length === 0) {
      console.log('Sucursal 108 does not exist. Creating it...');
      const { error: insertErr } = await client.database.from('sucursales').insert([
        {
          codigo: '108',
          nombre_negocio: 'Sucursal de Pruebas 108',
          direccion: 'Sector Santa María, Maracaibo',
          responsable_nombre: 'Heric',
          responsable_apellido: 'Guedez',
          telefono: '04146602325',
          email: 'heric@alienwater.com',
          ciudad: 'Maracaibo',
          tipo_maquina: 'moneda_qr'
        }
      ]);
      
      if (insertErr) {
        console.error('Error inserting sucursal:', insertErr);
        return;
      }
      console.log('✅ Sucursal 108 created successfully!');
    } else {
      console.log('✅ Sucursal 108 already exists in database.');
    }

    console.log('2. Counting free QRs in sucursal 108...');
    const { data: count108, error: countErr } = await client.database
      .from('creditos')
      .select('qr_code')
      .is('phone', null)
      .eq('sucursal', '108');
      
    if (countErr) {
      console.error('Error counting QRs:', countErr);
      return;
    }

    console.log(`Sucursal 108 currently has ${count108.length} free QR codes assigned.`);

    if (count108.length < 50) {
      console.log('Assigning 100 free QR codes to sucursal 108...');
      
      // Get 100 free QRs from sucursal 100
      const { data: freeQRs, error: fetchErr } = await client.database
        .from('creditos')
        .select('qr_code')
        .is('phone', null)
        .eq('sucursal', '100')
        .limit(100);
        
      if (fetchErr) {
        console.error('Error fetching free QRs:', fetchErr);
        return;
      }
      
      if (freeQRs.length === 0) {
        console.log('❌ No free QR codes available in sucursal 100 to reassign!');
        return;
      }

      console.log(`Found ${freeQRs.length} free QRs. Reassigning them to sucursal 108...`);
      const qrCodes = freeQRs.map(q => q.qr_code);
      
      const { error: updateErr } = await client.database
        .from('creditos')
        .update({ sucursal: '108' })
        .in('qr_code', qrCodes);
        
      if (updateErr) {
        console.error('Error updating QRs:', updateErr);
        return;
      }
      console.log('✅ 100 free QR codes reassigned to sucursal 108 successfully!');
    } else {
      console.log('✅ Sucursal 108 already has sufficient free QR codes.');
    }

  } catch (err) {
    console.error('Exception caught:', err);
  }
}

main();
