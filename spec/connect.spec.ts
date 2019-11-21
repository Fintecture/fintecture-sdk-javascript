import nock from 'nock';

import { Fintecture } from '../Fintecture';
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

const appId = process.env.app_id || '';
const appSecret = process.env.app_secret || '';
const appPrivateKey: string = process.env.app_private_key;

describe('Connect', function () {
    
    it('#PIS getConnectUrl', async function (done) {
        const redirectUri = '';
        const originUri = '';
        const state = 'bob';
        const version = '1.0';
        const mockConnectUrl = BaseUrls.FINTECTURECONNECTURL + '/pis?state=eyJhcHBfaWQiOiIzZjEyYTVjMC1mNzE5LTRjMTQtOWVhYy0wOGVkOTkyOTAxMDkiLCJhcHBfc2VjcmV0IjoiOTNlYTAxMjgtODI1OC00YjFkLTkxMDktYjQ4OTlhOTg2NzdiIiwic2lnbmF0dXJlX3R5cGUiOiJyc2Etc2hhMjU2Iiwic2lnbmF0dXJlIjoiV0xzZm9oYmpzM0M5ZTM2QjlUYWNHTEl3a00zY0pMdEVTQUduTGdUN1Yvd1l6cGk4R2RKMUlIa1NPWmd3eStVTjl3RkVXTVdKOXFUaVY4bURCeFE3VUVhZHk5VHNDVkJNR0pXNUhZNFBvOFNrSU1MM1VrMnRPcVhmS05IR2pYR0RWdXVUbEJxUExRV3FIdDdpRmZNOUc1c252WjNQQjhsODNFOU9LTWVSQ1o2NmF2cGhnQnNpY3E4Y1lBS3hsYjFZNDZwYWF3RE92eDlSOTRBTlpkT3h2cUs0V2tWSm5DdTAzVjBTc0ZTVWZDVHBJMjhCUmZ3akM4OXp4MEEzVnY4MWlCMVorSmRzRDhLYTZacEhaQkNHdlRnZjk3K0dUVDBtbHpURUxMSlpDTEt0S2pYQ2NLVXBIZ3gzRkR5d0pNaVN6K0ZGUjZ0bGhLOHgzVDBzWGs4RWJ3PT0iLCJyZWRpcmVjdF91cmkiOiIiLCJvcmlnaW5fdXJpIjoiIiwic3RhdGUiOiJib2IiLCJvcmRlcl9pZCI6MSwicGF5bG9hZCI6eyJkYXRhIjp7InR5cGUiOiJTRVBBIiwiYXR0cmlidXRlcyI6eyJhbW91bnQiOjEyNSwiY3VycmVuY3kiOiJFVVIiLCJjb21tdW5pY2F0aW9uIjoiMSIsImVuZF90b19lbmRfaWQiOiI1Zjc4ZTkwMjkwN2U0MjA5YWE4ZGY2MzY1OWIwNWQyNCJ9fSwibWV0YSI6eyJwc3VfbG9jYWxfaWQiOjEsInBzdV9uYW1lIjoiVGVzdCBib3QiLCJwc3VfZW1haWwiOiJlbWFpbEB0ZXN0LmNvbSIsInBzdV9pcCI6IjE5Mi4xNjguMC4xIn19LCJ2ZXJzaW9uIjoiMS4wIn0=';
        let connectUrl = await Fintecture.getConnectUrl(paymentParams, 'pis', appId, appSecret, appPrivateKey, redirectUri, originUri, state, version);

        expect(connectUrl).toEqual(mockConnectUrl);
        done();
    });

    it('#AIS getConnectUrl', async function (done) {
        const redirectUri = '';
        const originUri = '';
        const state = 'bob';
        const version = '1.0';
        const mockConnectUrl = BaseUrls.FINTECTURECONNECTURL + '/ais?state=eyJhcHBfaWQiOiIzZjEyYTVjMC1mNzE5LTRjMTQtOWVhYy0wOGVkOTkyOTAxMDkiLCJhcHBfc2VjcmV0IjoiOTNlYTAxMjgtODI1OC00YjFkLTkxMDktYjQ4OTlhOTg2NzdiIiwic2lnbmF0dXJlX3R5cGUiOiJyc2Etc2hhMjU2Iiwic2lnbmF0dXJlIjoiV0xzZm9oYmpzM0M5ZTM2QjlUYWNHTEl3a00zY0pMdEVTQUduTGdUN1Yvd1l6cGk4R2RKMUlIa1NPWmd3eStVTjl3RkVXTVdKOXFUaVY4bURCeFE3VUVhZHk5VHNDVkJNR0pXNUhZNFBvOFNrSU1MM1VrMnRPcVhmS05IR2pYR0RWdXVUbEJxUExRV3FIdDdpRmZNOUc1c252WjNQQjhsODNFOU9LTWVSQ1o2NmF2cGhnQnNpY3E4Y1lBS3hsYjFZNDZwYWF3RE92eDlSOTRBTlpkT3h2cUs0V2tWSm5DdTAzVjBTc0ZTVWZDVHBJMjhCUmZ3akM4OXp4MEEzVnY4MWlCMVorSmRzRDhLYTZacEhaQkNHdlRnZjk3K0dUVDBtbHpURUxMSlpDTEt0S2pYQ2NLVXBIZ3gzRkR5d0pNaVN6K0ZGUjZ0bGhLOHgzVDBzWGs4RWJ3PT0iLCJyZWRpcmVjdF91cmkiOiIiLCJvcmlnaW5fdXJpIjoiIiwic3RhdGUiOiJib2IiLCJvcmRlcl9pZCI6MSwicGF5bG9hZCI6eyJkYXRhIjp7InR5cGUiOiJTRVBBIiwiYXR0cmlidXRlcyI6eyJhbW91bnQiOjEyNSwiY3VycmVuY3kiOiJFVVIiLCJjb21tdW5pY2F0aW9uIjoiMSIsImVuZF90b19lbmRfaWQiOiI1Zjc4ZTkwMjkwN2U0MjA5YWE4ZGY2MzY1OWIwNWQyNCJ9fSwibWV0YSI6eyJwc3VfbG9jYWxfaWQiOjEsInBzdV9uYW1lIjoiVGVzdCBib3QiLCJwc3VfZW1haWwiOiJlbWFpbEB0ZXN0LmNvbSIsInBzdV9pcCI6IjE5Mi4xNjguMC4xIn19LCJ2ZXJzaW9uIjoiMS4wIn0=';
        let connectUrl = await Fintecture.getConnectUrl(paymentParams, 'ais', appId, appSecret, appPrivateKey, redirectUri, originUri, state, version);

        expect(connectUrl).toEqual(mockConnectUrl);
        done();
    });

    it('#PIS getConnectUrl Error no Payment parameters', async function (done) {
        const redirectUri = '';
        const originUri = '';
        let errorMessage = 'No error thrown.';

        try {
            await Fintecture.getConnectUrl({}, 'pis', appId, appSecret, appPrivateKey, redirectUri, originUri);
        } catch (error) {
            errorMessage = error.message;
        }
        expect(errorMessage).toBe('invalid payment payload');

        done();
    });

    it('#PIS getConnectUrl Error no amount', async function (done) {
        const redirectUri = '';
        const originUri = '';
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
            await Fintecture.getConnectUrl(paymentParams, 'pis', appId, appSecret, appPrivateKey, redirectUri, originUri);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no currency', async function (done) {
        const redirectUri = '';
        const originUri = '';
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
            await Fintecture.getConnectUrl(paymentParams, 'pis', appId, appSecret, appPrivateKey, redirectUri, originUri);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no order_id', async function (done) {
        const redirectUri = '';
        const originUri = '';
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
            await Fintecture.getConnectUrl(paymentParams, 'pis', appId, appSecret, appPrivateKey, redirectUri, originUri);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no customer_id', async function (done) {
        const redirectUri = '';
        const originUri = '';
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
            await Fintecture.getConnectUrl(paymentParams, 'pis', appId, appSecret, appPrivateKey, redirectUri, originUri);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no customer_full_name', async function (done) {
        const redirectUri = '';
        const originUri = '';
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
            await Fintecture.getConnectUrl(paymentParams, 'pis', appId, appSecret, appPrivateKey, redirectUri, originUri);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no customer_email', async function (done) {
        const redirectUri = '';
        const originUri = '';
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
            await Fintecture.getConnectUrl(paymentParams, 'pis', appId, appSecret, appPrivateKey, redirectUri, originUri);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no customer_ip', async function (done) {
        const redirectUri = '';
        const originUri = '';
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
            await Fintecture.getConnectUrl(paymentParams, 'pis', appId, appSecret, appPrivateKey, redirectUri, originUri);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl Error no type', async function (done) {
        const redirectUri = '';
        const originUri = '';
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
            await Fintecture.getConnectUrl(paymentParams, '', appId, appSecret, appPrivateKey, redirectUri, originUri);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid payment payload');
        done();
    });

    it('#PIS getConnectUrl no ent_to_end_id', async function (done) {
        const redirectUri = '';
        const originUri = '';

        let paymentParams = {
            amount: 125,
            currency: 'EUR',
            order_id: 1,
            customer_id: 1,
            customer_full_name: 'Test bot',
            customer_email: 'email@test.com',
            customer_ip: '192.168.0.1',
        };
        
        let connectUrl = await Fintecture.getConnectUrl(paymentParams, 'pis', appId, appSecret, appPrivateKey, redirectUri, originUri);
        const sp = connectUrl.split('/');
        const pathConnectUrl = connectUrl.replace(`${sp[0]}/${sp[1]}/${sp[2]}`, '');
        nock( connectUrl ).get( pathConnectUrl ).reply(200);
        done();
    });


});