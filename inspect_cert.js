const forge = require('node-forge');
const fs = require('fs');

try {
  const certDer = fs.readFileSync('c:\\Users\\user\\Downloads\\pass.cer');
  const certAsn1 = forge.asn1.fromDer(certDer.toString('binary'));
  const cert = forge.pki.certificateFromAsn1(certAsn1);
  
  console.log('--- CERTIFICATE INSPECTION ---');
  console.log('Subject:', cert.subject.attributes.map(a => `${a.shortName || a.name}: ${a.value}`).join(', '));
  
  const uid = cert.subject.getField('UID');
  const ou = cert.subject.getField('OU');
  
  console.log('Detected Pass Type ID (UID):', uid ? uid.value : 'NOT FOUND');
  console.log('Detected Team ID (OU):', ou ? ou.value : 'NOT FOUND');
  console.log('------------------------------');

} catch (err) {
  console.error('Error reading cert:', err.message);
}
