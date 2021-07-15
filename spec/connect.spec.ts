import { FintectureClient } from '../fintecture-client';
import { IPisSetup, IAisSetup } from './../src/interfaces/connect/ConnectInterface';
import { TestConfig } from './constants/config';

const connectPisConfigMin: IPisSetup = {
    amount: 125,
    currency: 'EUR',
    communication: 'Thanks mom!',
    redirect_uri: 'https://www.google.com/callback',
    origin_uri: 'https://www.google.com/shop',
};

const connectPisConfigFull: IPisSetup = {
    amount: 125,
    currency: 'EUR',
    communication: 'Thanks mom!',
    customer_full_name: 'Bob Smith',
    customer_email: 'bob.smith@gmail.com',
    customer_ip: '123.456.789.123',
    redirect_uri: 'https://www.google.com/callback',
    origin_uri: 'https://www.google.com/shop',
    state: 'somestate'
};

const connectAisMin: IAisSetup = {
    redirect_uri: 'https://www.google.com/callback',
    origin_uri: 'https://www.google.com/shop',
    state: 'somestate'
};


const client = new FintectureClient({ app_id: TestConfig.appIdMerchant, app_secret: TestConfig.appSecretMerchant, private_key: TestConfig.appPrivKeyMerchant });

describe('Connect', () => {
    it('#PIS getPisConnect', async (done) => {
        const tokens: any = await client.getAccessToken();
        const connectMin = await client.getPisConnect(tokens.access_token, connectPisConfigMin);
        expect(!!connectMin.session_id).toBe(true);
        const connectFull = await client.getPisConnect(tokens.access_token, connectPisConfigFull);
        expect(!!connectFull.session_id).toBe(true);
        expect(connectFull.url.length).toBeGreaterThan(connectMin.url.length)
        done();
    });

    it('#AIS getAisConnectUrl', async (done) => {
        const connect = await client.getAisConnect(null, connectAisMin);
        expect(!!connect.url).toBe(true);
        done();
    });


    it('#PIS getConnectUrl Error no amount', async (done) => {
        let errorMessage = 'No error thrown.';

        const ConnectUrlFulltemp = Object.assign({}, connectPisConfigFull);
        delete ConnectUrlFulltemp['amount'];

        try {
            const tokens: any = await client.getAccessToken();
            await client.getPisConnect(tokens.access_token, ConnectUrlFulltemp);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('amount not set');
        done();
    });

    it('#PIS getConnectUrl Error no currency', async (done) => {
        let errorMessage = 'No error thrown.';

        const ConnectUrlFulltemp = Object.assign({}, connectPisConfigFull);
        delete ConnectUrlFulltemp['currency'];

        try {
            const tokens: any = await client.getAccessToken();
            await client.getPisConnect(tokens.access_token, ConnectUrlFulltemp);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('currency not set');
        done();
    });

});