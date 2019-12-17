import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { IConfig } from '../interfaces/ConfigInterface';
import { Constants } from './Constants';

export function generateUUID() {
  return uuidv4().replace(/-/g, '');
}

export function generateUUIDv4() {
  return uuidv4();
}

export function createSignatureHeader(headers: any, config: IConfig) {
  let signingString = '';
  let headerString = '';

  Constants.SIGNEDHEADERPARAMETERLIST.forEach(param => {
    if (headers[param]) {
      const p = param.toLowerCase();
      signingString = signingString ? signingString + '\n' : signingString;
      signingString = signingString + p + ': ' + headers[param];
      headerString = headerString ? headerString + ' ' + p : p;
    }
  });

  const signature = signPayload(signingString, config.private_key);
  return (
    'keyId="' + config.app_id + '",algorithm="rsa-sha256",headers="' + headerString + '",signature="' + signature + '"'
  );
}

export function signPayload(payload: any, privateKey: string, algorithm?: string): string {
  if (typeof payload === 'object') {
    payload = JSON.stringify(payload);
  }

  if (!algorithm || algorithm === 'rsa-sha256') {
    try {
      const signature = crypto.createSign('RSA-SHA256');
      signature.update(payload);
      signature.end();
      return signature.sign(privateKey).toString('base64');
    } catch (error) {
      throw new Error('error during signature');
    }
  }

  throw new Error('invalid signature algorithm');
}

export function decryptPrivate(digest: string, privateKey: string): string {
  const digestBytes = Buffer.from(digest, 'base64');
  const cryptoConstants: any = crypto['constants'];
  const key = {
    key: privateKey, // buffer
    padding: cryptoConstants.RSA_PKCS1_OAEP_PADDING,
  };

  try {
    return crypto.privateDecrypt(key, digestBytes).toString();
  } catch (error) {
    throw new Error('an error occurred while decrypting');
  }
}

export function hashBase64(plainText: string): string {
  return crypto
    .createHash('sha256')
    .update(plainText)
    .digest('base64');
}
