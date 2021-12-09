import crypto from 'crypto';

import { FintectureClient } from '../fintecture-client';
import { TestConfig } from './constants/config';

describe('Validation', () => {
  const client = new FintectureClient({
    app_id: TestConfig.appIdMerchant,
    app_secret: TestConfig.appSecretMerchant,
    private_key: TestConfig.appPrivKeyMerchant,
  });

  it('Should authenticate the request', () => {
    const body = {
      state: 'a3028a42-b5b3-46ff-9bd1-2df6947d7c1e',
      session_id: 'f57a15da4e5c46f48402a2aee20fe428',
      status: 'payment_created',
    };
    const date = new Date().toUTCString();
    const digest = 'SHA-256=3t28x8jzK8J+XAKVkFeTpuK70i7z0b/wdMgc8umUsM0=';

    // Get the public key from the private key of the merchant
    const publicKey = crypto
      .createPublicKey({ key: TestConfig.appPrivKeyMerchant, format: 'pem' })
      .export({ format: 'pem', type: 'spki' });

    // Prepare the payload that we are going to encrypt using the public key
    const payload = [`date: ${date}`, `digest: ${digest}`].join('\n');

    // Encrypt the payload and encode it as base64
    const signature = crypto.publicEncrypt(publicKey, Buffer.from(payload)).toString('base64');

    const headers = {
      date,
      digest,
      signature: `keyId="${
        TestConfig.appIdMerchant
      }", algorithm="rsa-sha256", headers="date digest", signature="${signature}"`,
    };

    expect(client.validation.authenticateRequest(headers, body)).toBe(true);
  });
});
