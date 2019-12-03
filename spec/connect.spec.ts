import nock from 'nock';
import * as crypto from 'crypto';
import qs from 'qs';

import { Connect } from '../fintecture_client';
import { BaseUrls } from './../src/utils/URLBuilders/BaseUrls';
import { ConnectConfig } from './../src/interfaces/connect/ConfigInterface'

const privateKey: string = process.env.app_private_key || `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeEocGuXp9AA+H
/8o2exRRkCsU49h8COUuCtjHJgEL4Wz9mKb1tZ7w9yzBYZ+vyOSMbMFocvIHZQac
up1cYX6+5J/XcH8QDJRqfq/dr//3xMwYH+xFBVL8R6C6Hoie3sow4x1k+ihOIZ+Q
MOoDTR+dSPnWrYjzKLa6rESJHlBrzQ5Qgq8KnwmiInkTMZq1fyOY0fBTdJuikr7/
xEnQBl44P/gqQzEeiS6kOswoXVn5DhQUSyQSMfTmrhuswnc/Ud5faBbQz1ZegsNc
eY6S6/b89lI4vcj6SCubuDWUEIVongvijF14p/y/UIU0y1JtQsK/5tmtSNboCnNN
kuKA079zAgMBAAECggEAI14i3xLOALzsPLIzROhZ/fvjX8uxCuOUn64mnbx3nHhm
QgGPTcfC1ciAN46Hw7WPyYml5qBdXeExTw0EG4Dm8oBF8VbG30jpRkCtSc1Q2Nes
ELPH0hOkYzUFlc8yI1XW6IRQdeDw9rZYNNN08KMncTI8UFfInhtccz0LIqDpPo0r
T/LVe3hN6tyW48VThMhTbf7vOGg1+fxABu8uoKFFq8bs/rp5b3Cu/8nfyNksEaTg
kz8z5dWTS0BCTMBPjgWMRXiRghWkYwQX84EVjapuPQnsEaH8zKOemITviBlO6wfh
iD2wyVwNfLTwaBiixzxh3uZGti0wq4Hg0g/31MAWDQKBgQDRlH+Mr+5zzIuSBOKj
MvIqNli9W2n7yKzpGjQTTG4V2EOwE2vxY3fbB4oxNVRNa4B44YM19P7B7gwLiWnO
eEuC95pS+vYNcYvCUyAxBEBlBTKKV7VMuavPjNkLgQH9F4Dj/reKsXcqbOzxR/5n
VjNYgaNWXb4fUYNrqyUuWV0bTQKBgQDBFXdSC4maU7MRMahkWhf/70S0917c4csx
pUut43gMpjFBDQMnXERXQudqFGPlEvzs5HMLl373SMZHiHr8WDcRwdtHMGTJOVqj
pD0XONzkP9jrwUIOKrF65VIFj005maFpAeHG5ZakIZ7WjdXQxh7j06SqoK5caJOK
rXl/qXNlvwKBgHc5RP4hr0LM37Enek5g0wZUeFLwR/BmDodk0q8P0ag3qPnncoaV
kT9WoLSxo82PFDyv/Vaakrp70vpVJ42/PSW5+V6vSX4IU/suEqgPxRoyxLeSgZ6u
GSEu/OHgd+Mklbwd0QfjQOkvofL4g68BiKAWz3Z4SYnDc0Gy0Kn3SFIZAoGBAIuk
oMVfvsc0nZ9j0KuzVQQu4fwXpC4Px0tChvdeOia704d+h7dhzbNmmcNot86m6vHR
Tzsk+BiUM4LsvDXg/wMCtzpHT70Qk/MiB2TSJT+WxaXMAaAJVI7TZ3zJ5UoxSEGP
sOCOj2JpRl1Z+zeg8hpHqSIWT8RZhcuYJvUjcmg1AoGADluBhTWky1K+QwmQE0DO
OHkL0TyG6qQ/31nnuLW5Ej1xQtuElQVWj/KZK5AJrusXSUEUzqPMR7MvMSclURyV
Mqo3BZADRlcr0AKP2TYSBCNcEBmBHCI9GfIRCPFR1eK+IciRyqjcz7kYlZ0YyfjF
r3xIiGe3JhVHqyTRE+maKu0=
-----END PRIVATE KEY-----`;
const publicKey: string = process.env.app_public_key || `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnhKHBrl6fQAPh//KNnsU
UZArFOPYfAjlLgrYxyYBC+Fs/Zim9bWe8PcswWGfr8jkjGzBaHLyB2UGnLqdXGF+
vuSf13B/EAyUan6v3a//98TMGB/sRQVS/Eeguh6Int7KMOMdZPooTiGfkDDqA00f
nUj51q2I8yi2uqxEiR5Qa80OUIKvCp8JoiJ5EzGatX8jmNHwU3SbopK+/8RJ0AZe
OD/4KkMxHokupDrMKF1Z+Q4UFEskEjH05q4brMJ3P1HeX2gW0M9WXoLDXHmOkuv2
/PZSOL3I+kgrm7g1lBCFaJ4L4oxdeKf8v1CFNMtSbULCv+bZrUjW6ApzTZLigNO/
cwIDAQAB
-----END PUBLIC KEY-----`;

const paymentParams = {
    amount: 125,
    currency: 'EUR',
    order_id: 1,
    customer_id: 1,
    customer_full_name: 'Test bot',
    customer_email: 'email@test.com',
    customer_ip: '192.168.0.1',
    end_to_end_id: '5f78e902907e4209aa8df63659b05d24'
};

const connectConfig: ConnectConfig = {
    appId: process.env.app_id || '3f12a5c0-f719-4c14-9eac-08ed99290109',
    appSecret: process.env.app_secret || '93ea0128-8258-4b1d-9109-b4899a98677b',
    privateKey: privateKey,
    redirectUri: '',
    originUri: '',
    state: 'bob',
    version: '1.0'
};

const mockConnectPath = 'state=eyJhcHBfaWQiOiIzZjEyYTVjMC1mNzE5LTRjMTQtOWVhYy0wOGVkOTkyOTAxMDkiLCJhcHBfc2VjcmV0IjoiOTNlYTAxMjgtODI1OC00YjFkLTkxMDktYjQ4OTlhOTg2NzdiIiwic2lnbmF0dXJlX3R5cGUiOiJyc2Etc2hhMjU2Iiwic2lnbmF0dXJlIjoiV0xzZm9oYmpzM0M5ZTM2QjlUYWNHTEl3a00zY0pMdEVTQUduTGdUN1Yvd1l6cGk4R2RKMUlIa1NPWmd3eStVTjl3RkVXTVdKOXFUaVY4bURCeFE3VUVhZHk5VHNDVkJNR0pXNUhZNFBvOFNrSU1MM1VrMnRPcVhmS05IR2pYR0RWdXVUbEJxUExRV3FIdDdpRmZNOUc1c252WjNQQjhsODNFOU9LTWVSQ1o2NmF2cGhnQnNpY3E4Y1lBS3hsYjFZNDZwYWF3RE92eDlSOTRBTlpkT3h2cUs0V2tWSm5DdTAzVjBTc0ZTVWZDVHBJMjhCUmZ3akM4OXp4MEEzVnY4MWlCMVorSmRzRDhLYTZacEhaQkNHdlRnZjk3K0dUVDBtbHpURUxMSlpDTEt0S2pYQ2NLVXBIZ3gzRkR5d0pNaVN6K0ZGUjZ0bGhLOHgzVDBzWGs4RWJ3PT0iLCJyZWRpcmVjdF91cmkiOiIiLCJvcmlnaW5fdXJpIjoiIiwic3RhdGUiOiJib2IiLCJvcmRlcl9pZCI6MSwicGF5bG9hZCI6eyJkYXRhIjp7InR5cGUiOiJTRVBBIiwiYXR0cmlidXRlcyI6eyJhbW91bnQiOjEyNSwiY3VycmVuY3kiOiJFVVIiLCJjb21tdW5pY2F0aW9uIjoiMSIsImVuZF90b19lbmRfaWQiOiI1Zjc4ZTkwMjkwN2U0MjA5YWE4ZGY2MzY1OWIwNWQyNCJ9fSwibWV0YSI6eyJwc3VfbG9jYWxfaWQiOjEsInBzdV9uYW1lIjoiVGVzdCBib3QiLCJwc3VfZW1haWwiOiJlbWFpbEB0ZXN0LmNvbSIsInBzdV9pcCI6IjE5Mi4xNjguMC4xIn19LCJ2ZXJzaW9uIjoiMS4wIn0=';
const connect: Connect = new Connect(connectConfig);

describe('Connect', function () {
    
    it('#PIS getConnectUrl', async function (done) {
        const mockConnectUrl = BaseUrls.FINTECTURECONNECTURL + '/pis?' + mockConnectPath;
        const connect: Connect = new Connect(connectConfig);

        let connectUrl = await connect.getConnectUrl(paymentParams, 'pis');

        expect(connectUrl).toEqual(mockConnectUrl);
        done();
    });

    it('#AIS getConnectUrl', async function (done) {
        const mockConnectUrl = BaseUrls.FINTECTURECONNECTURL + '/ais?' + mockConnectPath;

        let connectUrl = await connect.getConnectUrl(paymentParams, 'ais');

        expect(connectUrl).toEqual(mockConnectUrl);
        done();
    });

    it('#PIS getConnectUrl Error no Payment parameters', async function (done) {
        let errorMessage = 'No error thrown.';

        try {
            await connect.getConnectUrl({}, 'pis');
        } catch (error) {
            errorMessage = error.message;
        }
        expect(errorMessage).toBe('invalid payment payload');

        done();
    });

    it('#PIS getConnectUrl Error no amount', async function (done) {
        let errorMessage = 'No error thrown.';

        let paymentParams = {
            currency: 'EUR',
            order_id: 1,
            customer_id: 1,
            customer_full_name: 'Test bot',
            customer_email: 'email@test.com',
            customer_ip: '192.168.0.1',
            end_to_end_id: '5f78e902907e4209aa8df63659b05d24'
        };

        try {
            await connect.getConnectUrl(paymentParams, 'pis');
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no currency', async function (done) {
        let errorMessage = 'No error thrown.';

        let paymentParams = {
            amount: 125,
            order_id: 1,
            customer_id: 1,
            customer_full_name: 'Test bot',
            customer_email: 'email@test.com',
            customer_ip: '192.168.0.1',
            end_to_end_id: '5f78e902907e4209aa8df63659b05d24'
        };

        try {
            await connect.getConnectUrl(paymentParams, 'pis');
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no order_id', async function (done) {
        let errorMessage = 'No error thrown.';

        let paymentParams = {
            amount: 125,
            currency: 'EUR',
            customer_id: 1,
            customer_full_name: 'Test bot',
            customer_email: 'email@test.com',
            customer_ip: '192.168.0.1',
            end_to_end_id: '5f78e902907e4209aa8df63659b05d24'
        };

        try {
            await connect.getConnectUrl(paymentParams, 'pis');
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no customer_id', async function (done) {
        let errorMessage = 'No error thrown.';

        let paymentParams = {
            amount: 125,
            currency: 'EUR',
            order_id: 1,
            customer_full_name: 'Test bot',
            customer_email: 'email@test.com',
            customer_ip: '192.168.0.1',
            end_to_end_id: '5f78e902907e4209aa8df63659b05d24'
        };

        try {
            await connect.getConnectUrl(paymentParams, 'pis');
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no customer_full_name', async function (done) {
        let errorMessage = 'No error thrown.';

        let paymentParams = {
            amount: 125,
            currency: 'EUR',
            order_id: 1,
            customer_id: 1,
            customer_email: 'email@test.com',
            customer_ip: '192.168.0.1',
            end_to_end_id: '5f78e902907e4209aa8df63659b05d24'
        };

        try {
            await connect.getConnectUrl(paymentParams, 'pis');
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no customer_email', async function (done) {
        let errorMessage = 'No error thrown.';

        let paymentParams = {
            amount: 125,
            currency: 'EUR',
            order_id: 1,
            customer_id: 1,
            customer_full_name: 'Test bot',
            customer_ip: '192.168.0.1',
            end_to_end_id: '5f78e902907e4209aa8df63659b05d24'
        };

        try {
            await connect.getConnectUrl(paymentParams, 'pis');
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no customer_ip', async function (done) {
        let errorMessage = 'No error thrown.';

        let paymentParams = {
            amount: 125,
            currency: 'EUR',
            order_id: 1,
            customer_id: 1,
            customer_full_name: 'Test bot',
            customer_email: 'email@test.com',
            end_to_end_id: '5f78e902907e4209aa8df63659b05d24'
        };

        try {
            await connect.getConnectUrl(paymentParams, 'pis');
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no type', async function (done) {
        let errorMessage = 'No error thrown.';

        let paymentParams = {
            amount: 125,
            currency: 'EUR',
            order_id: 1,
            customer_id: 1,
            customer_full_name: 'Test bot',
            customer_email: 'email@test.com',
            customer_ip: '192.168.0.1',
            end_to_end_id: '5f78e902907e4209aa8df63659b05d24'
        };

        try {
            await connect.getConnectUrl(paymentParams, '');
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl no end_to_end_id', async function (done) {
        let paymentParams = {
            amount: 125,
            currency: 'EUR',
            order_id: 1,
            customer_id: 1,
            customer_full_name: 'Test bot',
            customer_email: 'email@test.com',
            customer_ip: '192.168.0.1',
        };
        
        let anotherConfig: ConnectConfig = {
            appId: process.env.app_id || '3f12a5c0-f719-4c14-9eac-08ed99290109',
            appSecret: process.env.app_secret || '93ea0128-8258-4b1d-9109-b4899a98677b',
            privateKey: privateKey,
            redirectUri: '',
            originUri: '',
            version: '1.0'
        };
        const anotherConnect = new Connect(anotherConfig);
        let connectUrl = await anotherConnect.getConnectUrl(paymentParams, 'pis');
        const sp = connectUrl.split('/');
        const pathConnectUrl = connectUrl.replace(`${sp[0]}/${sp[1]}/${sp[2]}`, '');
        nock( connectUrl ).get( pathConnectUrl ).reply(200);
        done();
    });

    it('#verifyUrlParameters(connectConfig, parameters, privateKey) true', () => {
        const parameters = {
            s: undefined,
            session_id: 'session_id',
            status: 'status',
            customer_id: 'customer_id',
            provider: 'provider',
            state: 'state'
        };

        // Generate encrypted
        const plainText = qs.stringify({
            app_id: connectConfig.appId,
            app_secret: connectConfig.appSecret,
            session_id: parameters.session_id,
            status: parameters.status,
            customer_id: parameters.customer_id,
            provider: parameters.provider,
            state: parameters.state
        });
        
        let digest =  crypto.createHash('sha256').update(plainText).digest('base64');
        //RSA based public key encryption (max 245 bytes)
        let key = {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        }
        let message = Buffer.from(digest);
        let encrypted = crypto.publicEncrypt(key, message).toString("base64");
        parameters.s = encrypted;
        
        let response: boolean = connect.verifyUrlParameters(parameters, privateKey);

        expect( response ).toBe( true )
    });

    it('#verifyUrlParameters(connectConfig, parameters, privateKey) false', () => {
        const parameters = {
            s: undefined,
            session_id: 'session_id',
            status: 'status',
            customer_id: 'customer_id',
            provider: 'provider',
            state: 'state'
        };

        // Generate encrypted
        const plainText = qs.stringify({
            app_id: 'other_app_id',
            app_secret: connectConfig.appSecret,
            session_id: parameters.session_id,
            status: parameters.status,
            customer_id: parameters.customer_id,
            provider: parameters.provider,
            state: parameters.state
        });
        
        let digest =  crypto.createHash('sha256').update(plainText).digest('base64');
        //RSA based public key encryption (max 245 bytes)
        let key = {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        }
        let message = Buffer.from(digest);
        let encrypted = crypto.publicEncrypt(key, message).toString("base64");
        parameters.s = encrypted;
        
        let response: boolean = connect.verifyUrlParameters(parameters, privateKey);

        expect( response ).toBe( false )
    });

    it('#verifyUrlParameters(connectConfig, parameters, privateKey) invalid param type', () => {
        expect( () => {
            connect.verifyUrlParameters('param', privateKey)
        } ).toThrow(new Error("invalid parameter format, the parameter must be an object instead a string"));
    });

    it('#verifyUrlParameters(connectConfig, parameters, privateKey) Error no digest', () => {
        const parameters = {
            session_id: 'session_id',
            status: 'status',
            customer_id: 'customer_id',
            provider: 'provider',
            state: 'state'
        };

        expect( () => {
            connect.verifyUrlParameters(parameters, privateKey)
        } ).toThrow(new Error("invalid post payment parameter"));
    });

    it('#verifyUrlParameters(connectConfig, parameters, privateKey) Error no session_id', () => {
        const parameters = {
            s: 'test_digest',
            status: 'status',
            customer_id: 'customer_id',
            provider: 'provider',
            state: 'state'
        };

        expect( () => {
            connect.verifyUrlParameters(parameters, privateKey)
        } ).toThrow(new Error("invalid post payment parameter"));
    });

    it('#verifyUrlParameters(connectConfig, parameters, privateKey) Error no status', () => {
        const parameters = {
            s: 'test_digest',
            session_id: 'session_id',
            customer_id: 'customer_id',
            provider: 'provider',
            state: 'state'
        };

        expect( () => {
            connect.verifyUrlParameters(parameters, privateKey)
        } ).toThrow(new Error("invalid post payment parameter"));
    });

    it('#verifyUrlParameters(connectConfig, parameters, privateKey) Error no customer_id', () => {
        const parameters = {
            s: 'test_digest',
            session_id: 'session_id',
            status: 'status',
            provider: 'provider',
            state: 'state'
        };

        expect( () => {
            connect.verifyUrlParameters(parameters, privateKey)
        } ).toThrow(new Error("invalid post payment parameter"));
    });

    it('#verifyUrlParameters(connectConfig, parameters, privateKey) Error no provider', () => {
        const parameters = {
            s: 'test_digest',
            session_id: 'session_id',
            status: 'status',
            customer_id: 'customer_id',
            state: 'state'
        };

        expect( () => {
            connect.verifyUrlParameters(parameters, privateKey)
        } ).toThrow(new Error("invalid post payment parameter"));
    });

    it('#verifyUrlParameters(connectConfig, parameters, privateKey) Error no state', () => {
        const parameters = {
            s: 'test_digest',
            session_id: 'session_id',
            status: 'status',
            customer_id: 'customer_id',
            provider: 'provider',
        };

        expect( () => {
            connect.verifyUrlParameters(parameters, privateKey)
        } ).toThrow(new Error("invalid post payment parameter"));
    });


});