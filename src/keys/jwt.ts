import fs from 'fs';

export const privateKey = fs.readFileSync('jwt/privateKey.pem', { encoding: 'utf-8' });
export const publicKey = fs.readFileSync('jwt/publicKey.pem', { encoding: 'utf-8' });

// import crypto from 'node:crypto';

// export const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
//   modulusLength: 2048,
//   privateKeyEncoding: {
//     format: 'pem',
//     type: 'pkcs8',
//     cipher: 'aes-256-cbc',
//     passphrase: 'adwf',
//   },
//   publicKeyEncoding: {
//     format: 'pem',
//     type: 'spki',
//   }
// } satisfies crypto.RSAKeyPairOptions<'pem', 'pem'>);