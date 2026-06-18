import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: 'https://insforge.alienwatermcbo.com',
  anonKey: 'ik_449c6ad841607ca640cc6c61acc8d2ce1549bc578c2d38796a77734abeec08e6'
});

async function main() {
  try {
    console.log("Sending test email...");
    const { data, error } = await client.emails.send({
      to: 'hericj@gmail.com',
      subject: 'Prueba de Correo - Alien Water',
      html: '<h1>Prueba de Correo</h1><p>Esta es una prueba de envío de correo desde la API de InsForge.</p>'
    });
    
    console.log("Response data:", data);
    console.log("Response error:", error);
  } catch (err) {
    console.error("Caught error:", err);
  }
}

main();
