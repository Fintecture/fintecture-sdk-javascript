import URL from 'url';
import qs from 'qs';
import request from 'request';

import { FintectureClient } from '../fintecture-client';
import { TestConfig } from './constants/config';

const AISproviderIdTest = process.env.AIS_PROVIDER_ID_TEST || 'cmmcfr';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

AISproviderIdTest.split(',').forEach( (providerId) => {
    providerId = providerId.trim();

    describe(`AIS - get fintecture access token - `, () => {
        const client = new FintectureClient({ app_id: TestConfig.appIdOpenbanking, app_secret: TestConfig.appSecretOpenbanking, private_key: TestConfig.appPrivKeyOpenbanking });
        const redirectUri = TestConfig.appRedirectUri;
        let accessToken;
        let customerId;

        beforeAll(async (done) => {

            const providerAuth: any = await client.getRedirectAuthUrl(null, providerId, redirectUri);
            request({
                url: providerAuth.url,
                method: 'GET',
                followRedirect: false
            }, (error, response, body) => {
                const redirectUrl = response.headers["location"];
                request({
                    url: redirectUrl,
                    method: 'GET',
                    followRedirect: false
                }, async (error, response, body) => {
                    const params = qs.parse(URL.parse(response.headers["location"]).query);
                    customerId = params.customer_id;
                    const code = params.code;
                    const tokens:any = await client.getAccessToken(code);

                    accessToken = tokens.access_token;
                    expect(!!accessToken).toBe(true);
                    expect(!!customerId).toBe(true);
                    done();

                });
            });
        });


        let account;

        it(`get provider ${providerId} AIS account with PSU IP`, async (done) => {
            const filters = null;
            const extras = {'x-psu-ip-address': '172.0.0.1'}
            const accounts: any = await client.getAccounts(accessToken, customerId, filters, extras);
            account = accounts.data[0].id
            expect(accounts.data.length).toBeGreaterThan(0);
            done();
        });

        
        it(`get provider ${providerId} AIS account `, async (done) => {
            const accounts: any = await client.getAccounts(accessToken, customerId);
            account = accounts.data[0].id
            expect(accounts.data.length).toBeGreaterThan(0);
            done();
        });

        it(`get provider ${providerId} AIS auth URL with app_id `, async (done) => {
            const transactions: any = await client.getTransactions(accessToken, customerId, account);
            expect(transactions.data.length).toBeGreaterThan(0);
            done();
        });

        it(`get provider ${providerId} AIS auth URL with app_id with PSU IP`, async (done) => {
            const filters = null;
            const extras = {'x-psu-ip-address': '172.0.0.1'}
            const transactions: any = await client.getTransactions(accessToken, customerId, account, filters, extras);
            expect(transactions.data.length).toBeGreaterThan(0);
            done();
        });

        afterAll(async (done) => {
            const deletedCustomer: any = await client.deleteCustomer(accessToken, customerId);
            expect(deletedCustomer.meta.status).toBe(200);
            expect(deletedCustomer.meta.code).toBe("customer_deleted");
            done();
        });
        
    });
});