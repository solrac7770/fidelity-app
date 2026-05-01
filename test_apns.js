const crypto = require('crypto');
const https = require('https');
const http2 = require('http2');

async function testPush() {
  const p8Pem = `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgoW7TNOABhFLUnGS2
BzxtYjKOpVER6cbJsXsLDI8orkGgCgYIKoZIzj0DAQehRANCAATiioOs7Q94kynm
1onteFK1wToRUxZ+JDSA1HdCAlAB3NdeRjvUSXZMqga1lPBXDvPsys2Y1VzeT9S4
SMdYYiZR
-----END PRIVATE KEY-----`;

  const keyId = '77A3DUF4S5';
  const teamId = 'D734HNJ3VC';
  const pushToken = 'ef6a854286868a1e5c3185096bf05e73e14803148acb1b77757333a4bc3ddae9';
  const passTypeId = 'pass.com.nexova.fidelity';

  const pemContents = p8Pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\\n/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/\s+/g, '');

  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  const cryptoKey = await global.crypto.subtle.importKey(
    'pkcs8', binaryKey.buffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  );
  
  const header = { alg: 'ES256', kid: keyId };
  const payload = { iss: teamId, iat: Math.floor(Date.now() / 1000) };
  
  const encoder = new TextEncoder();
  const base64UrlEncode = (arrayBuffer) => {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  const headerB64 = base64UrlEncode(encoder.encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const signatureBuffer = await global.crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    cryptoKey,
    encoder.encode(signingInput)
  );
  
  const signatureB64 = base64UrlEncode(signatureBuffer);
  const jwt = `${signingInput}.${signatureB64}`;
  
  console.log("Sending Push to APNs...");
  
  // Apple Push requires HTTP/2, but node's fetch handles it or we can use http2 directly.
  // Wait, does native node fetch support HTTP/2? No, Node.js fetch does NOT support HTTP/2 natively yet!
  // Cloudflare Workers fetch DOES support HTTP/2.
  // If we try with HTTP/1.1 (node fetch), APNs might reject it or fail.
  // We must use http2 module for APNs.
  
  const client = http2.connect('https://api.push.apple.com');
  
  const req = client.request({
    ':method': 'POST',
    ':path': `/3/device/${pushToken}`,
    'authorization': `bearer ${jwt}`,
    'apns-topic': passTypeId,
    'apns-push-type': 'background',
    'apns-priority': '5'
  });
  
  req.on('response', (headers, flags) => {
    console.log("Status:", headers[':status']);
  });
  
  req.setEncoding('utf8');
  let data = '';
  req.on('data', (chunk) => { data += chunk; });
  req.on('end', () => {
    console.log("Response:", data);
    client.close();
  });
  
  req.write('{}');
  req.end();
}

testPush();
