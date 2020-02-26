import { v4 as uuidv4 } from 'uuid';
import { createHash, createSign } from 'crypto';
import { IFintectureConfig } from '../interfaces/ConfigInterface';
import { Constants } from './Constants';

export function generateUUID() {
  return uuidv4().replace(/-/g, '');
}

export function generateUUIDv4() {
  return uuidv4();
}

export function createSignatureHeader(headers: any, config: IFintectureConfig, signedHeaders: any) {
  const signingString = buildSigningString(headers, signedHeaders);
  const headerString = buildHeaderString(headers, signedHeaders);
  
  const signature = signPayload(signingString, config.private_key);
  return (
    'keyId="' + config.app_id + '",algorithm="rsa-sha256",headers="' + headerString + '",signature="' + signature + '"'
  );
}

export function buildSigningString(headers, signedHeaders): string {
  let signingString = '';

  signedHeaders.forEach(param => {
    if (headers[param]) {
      const p = param.toLowerCase();
      signingString = signingString ? signingString + '\n' : signingString;
      signingString = signingString + p + ': ' + headers[param];
    }
  });

  return signingString;
}

export function buildHeaderString(headers, signedHeaders): string {
  let headerString = '';

  signedHeaders.forEach(param => {
    if (headers[param]) {
      const p = param.toLowerCase();
      headerString = headerString ? headerString + ' ' + p : p;
    }
  });

  return headerString;
}

export function signPayload(payload: any, privateKey: string, algorithm?: string): string {
  if (typeof payload === 'object') {
    payload = JSON.stringify(payload);
  }

  if (!algorithm || algorithm === 'rsa-sha256') {
    try {
      const signature = createSign('RSA-SHA256');
      signature.update(payload);
      signature.end();
      return signature.sign(privateKey).toString('base64');
    } catch (error) {
      throw new Error('error during signature');
    }
  }

  throw new Error('invalid signature algorithm');
}

export function hashBase64(plainText: string): string {
  return createHash('sha256').update(plainText).digest('base64');
}
