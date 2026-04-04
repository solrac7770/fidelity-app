import JSZip from 'jszip';
import forge from 'node-forge';
import crypto from 'crypto';

function signManifest(manifestBuffer, signerCertPem, signerKeyPem, wwdrCertPem) {
  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(manifestBuffer.toString('utf8'), 'utf8');
  
  const signerCert = forge.pki.certificateFromPem(signerCertPem);
  p7.addCertificate(signerCert);
  
  if (wwdrCertPem) {
    p7.addCertificate(forge.pki.certificateFromPem(wwdrCertPem));
  }
  
  const privateKey = forge.pki.privateKeyFromPem(signerKeyPem);
  
  p7.addSigner({
    key: privateKey,
    certificate: signerCert,
    digestAlgorithm: forge.pki.oids.sha1,
    authenticatedAttributes: [
      {
        type: forge.pki.oids.contentType,
        value: forge.pki.oids.data
      },
      {
        type: forge.pki.oids.messageDigest
      },
      {
        type: forge.pki.oids.signingTime
      }
    ]
  });
  
  p7.sign({ detached: true });
  
  return Buffer.from(forge.asn1.toDer(p7.toAsn1()).getBytes(), 'binary');
}

console.log("Ready to sign!");
