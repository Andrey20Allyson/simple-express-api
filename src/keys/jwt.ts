import crypto from 'crypto';
import fs from 'fs';
import { config } from '../config';

export interface JWTKeys {
  privateKey: string;
  publicKey: string;
}

function generateJWTKeys(): JWTKeys {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: {
      format: 'pem',
      type: 'pkcs8',
      cipher: 'aes-256-cbc',
      passphrase: 'adwf',
    },
    publicKeyEncoding: {
      format: 'pem',
      type: 'spki',
    }
  } satisfies crypto.RSAKeyPairOptions<'pem', 'pem'>);
}

function readJWTKeys(): JWTKeys {
  try {
    const privateKey = fs.readFileSync('jwt/privateKey.pem', { encoding: 'utf-8' });
    const publicKey = fs.readFileSync('jwt/publicKey.pem', { encoding: 'utf-8' });

    return { privateKey, publicKey };
  } catch {
    throw new Error(`Can't find jwt keys at directory 'jwt/'!`);
  }
}

function getJWTKeys(): JWTKeys {
  switch (config.jwt.keys) {
    case 'auto':
      return generateJWTKeys();
    case 'read':
      return readJWTKeys();
  }
}

export const { privateKey, publicKey } = getJWTKeys();