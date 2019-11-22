import nock from 'nock';
import * as crypto from 'crypto';
import qs from 'qs';

import { Connect } from '../fintecture_client';
import { BaseUrls } from './../src/utils/URLBuilders/BaseUrls';

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

const connectConfig = {
    appId: process.env.app_id,
    appSecret: process.env.app_secret,
    privateKey: process.env.app_private_key,
    redirectUri: '',
    originUri: '',
    state: 'bob',
    version: '1.0'
};

const mockConnectPath = 'state=eyJhcHBfaWQiOiIzZjEyYTVjMC1mNzE5LTRjMTQtOWVhYy0wOGVkOTkyOTAxMDkiLCJhcHBfc2VjcmV0IjoiOTNlYTAxMjgtODI1OC00YjFkLTkxMDktYjQ4OTlhOTg2NzdiIiwic2lnbmF0dXJlX3R5cGUiOiJyc2Etc2hhMjU2Iiwic2lnbmF0dXJlIjoiV0xzZm9oYmpzM0M5ZTM2QjlUYWNHTEl3a00zY0pMdEVTQUduTGdUN1Yvd1l6cGk4R2RKMUlIa1NPWmd3eStVTjl3RkVXTVdKOXFUaVY4bURCeFE3VUVhZHk5VHNDVkJNR0pXNUhZNFBvOFNrSU1MM1VrMnRPcVhmS05IR2pYR0RWdXVUbEJxUExRV3FIdDdpRmZNOUc1c252WjNQQjhsODNFOU9LTWVSQ1o2NmF2cGhnQnNpY3E4Y1lBS3hsYjFZNDZwYWF3RE92eDlSOTRBTlpkT3h2cUs0V2tWSm5DdTAzVjBTc0ZTVWZDVHBJMjhCUmZ3akM4OXp4MEEzVnY4MWlCMVorSmRzRDhLYTZacEhaQkNHdlRnZjk3K0dUVDBtbHpURUxMSlpDTEt0S2pYQ2NLVXBIZ3gzRkR5d0pNaVN6K0ZGUjZ0bGhLOHgzVDBzWGs4RWJ3PT0iLCJyZWRpcmVjdF91cmkiOiIiLCJvcmlnaW5fdXJpIjoiIiwic3RhdGUiOiJib2IiLCJvcmRlcl9pZCI6MSwicGF5bG9hZCI6eyJkYXRhIjp7InR5cGUiOiJTRVBBIiwiYXR0cmlidXRlcyI6eyJhbW91bnQiOjEyNSwiY3VycmVuY3kiOiJFVVIiLCJjb21tdW5pY2F0aW9uIjoiMSIsImVuZF90b19lbmRfaWQiOiI1Zjc4ZTkwMjkwN2U0MjA5YWE4ZGY2MzY1OWIwNWQyNCJ9fSwibWV0YSI6eyJwc3VfbG9jYWxfaWQiOjEsInBzdV9uYW1lIjoiVGVzdCBib3QiLCJwc3VfZW1haWwiOiJlbWFpbEB0ZXN0LmNvbSIsInBzdV9pcCI6IjE5Mi4xNjguMC4xIn19LCJ2ZXJzaW9uIjoiMS4wIn0=';
const privateKey: string = process.env.app_private_key;
const publicKey: string = process.env.app_public_key;
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

    it('#PIS getConnectUrl no ent_to_end_id', async function (done) {
        let paymentParams = {
            amount: 125,
            currency: 'EUR',
            order_id: 1,
            customer_id: 1,
            customer_full_name: 'Test bot',
            customer_email: 'email@test.com',
            customer_ip: '192.168.0.1',
        };
        
        const other_config = {
            appId: process.env.app_id,
            appSecret: process.env.app_secret,
            privateKey: process.env.app_private_key,
            redirectUri: '',
            originUri: '',
            version: '1.0'
        };
        const other_connect: Connect = new Connect(other_config);
        
        let connectUrl = await other_connect.getConnectUrl(paymentParams, 'pis');
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