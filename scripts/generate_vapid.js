import crypto from 'node:crypto';

// Generate VAPID key pair using ECDSA with P-256 curve
const prime256v1 = crypto.createECDH('prime256v1');
prime256v1.generateKeys();

const publicKey = prime256v1.getPublicKey();
const privateKey = prime256v1.getPrivateKey();

// VAPID keys must be url-safe base64 encoded
const publicBase64 = publicKey.toString('base64url');
const privateBase64 = privateKey.toString('base64url');

console.log('--- VAPID KEYS GENERATED ---');
console.log('Public Key (Dùng cho VITE_VAPID_PUBLIC_KEY):');
console.log(publicBase64);
console.log('\nPrivate Key (Dùng cho server/backend gửi notification):');
console.log(privateBase64);
