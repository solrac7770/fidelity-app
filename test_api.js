const https = require('https');
const fs = require('fs');

https.get('https://fidelity-app-rs1.pages.dev/api/wallet/apple?data=%7B%22tarjetaId%22%3A%22123%22%2C%22comercioNombre%22%3A%22Fidelity%22%2C%22clienteNombre%22%3A%22Juan%22%7D', (res) => {
  const chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync('test.pkpass', buffer);
    console.log('Saved test.pkpass, length:', buffer.length);
  });
});
