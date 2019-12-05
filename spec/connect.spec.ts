import nock from 'nock';
import * as crypto from 'crypto';
import qs from 'qs';

import { FintectureClient } from '../fintecture-client';
import { BaseUrls } from './../src/utils/URLBuilders/BaseUrls';
import { ConnectConfig } from './../src/interfaces/connect/ConnectInterface';
import { TestConfig } from './constants/config';

const connectConfigMin: ConnectConfig = {
    amount: 125,
    currency: 'EUR',
    communication: 'Thanks mom!',
    redirect_uri: 'https://www.google.com/callback',
    origin_uri: 'https://www.google.com/shop',
};

const connectConfigFull: ConnectConfig = {
    amount: 125,
    currency: 'EUR',
    communication: 'Thanks mom!',
    end_to_end_id: '1234567890',
    customer_id: '9',
    customer_full_name: 'Bob Smith',
    customer_email: 'bob.smith@gmail.com',
    customer_ip: '123.456.789.123',
    redirect_uri: 'https://www.google.com/callback',
    origin_uri: 'https://www.google.com/shop',
    state: 'somestate'
};

const client = new FintectureClient({ app_id: TestConfig.app_id_merchant, app_secret: TestConfig.app_secret_merchant, private_key: TestConfig.app_priv_key_openbanking });

describe('Connect', function () {
    it('#PIS getPisConnectUrl', async function (done) {
        const mockConnectUrl = BaseUrls.FINTECTURECONNECTURL_SBX + '/pis?state=';
        let tokens: any = await client.getAccessToken();
        let connectUrlMin = await client.getPisConnectUrl(tokens.access_token, connectConfigMin);
        console.log("==>> connectUrlMin", connectUrlMin)
        expect(connectUrlMin).toContain(mockConnectUrl);
        let connectUrlFull = await client.getPisConnectUrl(tokens.access_token, connectConfigFull);
        console.log("==>> connectUrlFull", connectUrlFull)
        expect(connectUrlFull).toContain(mockConnectUrl);
        expect(connectUrlFull.length).toBeGreaterThan(connectUrlMin.length)
        done();
    });
/*
    it('#AIS getAisConnectUrl', async function (done) {
        const mockConnectUrl = BaseUrls.FINTECTURECONNECTURL_SBX + '/ais?';

        let connectUrl = await connect.getAisConnectUrl(ConnectConfigMin);

        expect(connectUrl).toContain(mockConnectUrl);
        done();
    });
*/

    it('#PIS getConnectUrl Error no amount', async function (done) {
        let errorMessage = 'No error thrown.';

        let ConnectUrlFulltemp = Object.assign({}, connectConfigFull);
        delete ConnectUrlFulltemp['amount'];

        try {
            let tokens: any = await client.getAccessToken();
            await client.getPisConnectUrl(tokens.access_token, ConnectUrlFulltemp);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('amount not set');
        done();
    });

    it('#PIS getConnectUrl Error no currency', async function (done) {
        let errorMessage = 'No error thrown.';

        let ConnectUrlFulltemp = Object.assign({}, connectConfigFull);
        delete ConnectUrlFulltemp['currency'];

        try {
            let tokens: any = await client.getAccessToken();
            await client.getPisConnectUrl(tokens.access_token, ConnectUrlFulltemp);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('currency not set');
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
            app_id: TestConfig.app_id_merchant,
            app_secret: TestConfig.app_secret_merchant,
            session_id: parameters.session_id,
            status: parameters.status,
            customer_id: parameters.customer_id,
            provider: parameters.provider,
            state: parameters.state
        });
        
        let digest =  crypto.createHash('sha256').update(plainText).digest('base64');
        //RSA based public key encryption (max 245 bytes)
        let key = {
            key: TestConfig.app_pub_key_openbanking,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        }
        let message = Buffer.from(digest);
        let encrypted = crypto.publicEncrypt(key, message).toString("base64");
        parameters.s = encrypted;
        
        let response: boolean = client.verifyConnectUrlParameters(parameters);

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
            app_secret: TestConfig.app_secret_merchant,
            session_id: parameters.session_id,
            status: parameters.status,
            customer_id: parameters.customer_id,
            provider: parameters.provider,
            state: parameters.state
        });
        
        let digest =  crypto.createHash('sha256').update(plainText).digest('base64');
        //RSA based public key encryption (max 245 bytes)
        let key = {
            key: TestConfig.app_pub_key_openbanking,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        }
        let message = Buffer.from(digest);
        let encrypted = crypto.publicEncrypt(key, message).toString("base64");
        parameters.s = encrypted;
        
        let response: boolean = client.verifyConnectUrlParameters(parameters);

        expect( response ).toBe( false )
    });

    it('#verifyUrlParameters(connectConfig, parameters, privateKey) invalid param type', () => {
        expect( () => {
            client.verifyConnectUrlParameters('param')
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
            client.verifyConnectUrlParameters(parameters)
        } ).toThrow(new Error("missing query string"));
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
            client.verifyConnectUrlParameters(parameters)
        } ).toThrow(new Error("missing query string"));
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
            client.verifyConnectUrlParameters(parameters)
        } ).toThrow(new Error("missing query string"));
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
            client.verifyConnectUrlParameters(parameters)
        } ).toThrow(new Error("missing query string"));
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
            client.verifyConnectUrlParameters(parameters)
        } ).toThrow(new Error("missing query string"));
    });

});