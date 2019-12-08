import URL from 'url';
import qs from 'qs';
import request from 'request';

import { FintectureClient } from '../fintecture-client';
import { TestConfig } from './constants/config';

const AISproviderIdTest = process.env.AIS_PROVIDER_ID_TEST || 'cmmcfr';

AISproviderIdTest.split(',').forEach(function (providerId) {
    providerId = providerId.trim();

    describe(`AIS - get fintecture access token - `, function () {
        const client = new FintectureClient({ app_id: TestConfig.app_id_openbanking, app_secret: TestConfig.app_secret_openbanking });
        const redirectUri = TestConfig.app_redirect_uri;
        const state = 'somestate';
        let accessToken;
        let customerId;

        beforeAll(async function (done) {

            let providerAuth: any = await client.getProviderAuthUrl(null, providerId, redirectUri);
            request({
                url: providerAuth.url,
                method: 'GET',
                followRedirect: false
            }, function (error, response, body) {
                let redirectUrl = response.headers["location"];
                request({
                    url: redirectUrl,
                    method: 'GET',
                    followRedirect: false
                }, async function (error, response, body) {
                    let params = qs.parse(URL.parse(response.headers["location"]).query);
                    customerId = params.customer_id;
                    let code = params.code;
                    let tokens:any = await client.getAccessToken(code);

                    accessToken = tokens.access_token;
                    expect(!!accessToken).toBe(true);
                    expect(!!customerId).toBe(true);
                    done();

                });
            });
        });


        let account;

        it(`get provider ${providerId} AIS account `, async function (done) {

            const accounts: any = await client.getAccounts(accessToken, customerId);
            account = accounts.data[0].id
            expect(accounts.data.length).toBeGreaterThan(0);
            done();
        });

        it(`get provider ${providerId} AIS auth URL with app_id `, async function (done) {

            const transactions: any = await client.getTransactions(accessToken, customerId, account);
            expect(transactions.data.length).toBeGreaterThan(0);
            done();
        });
    });
});

function _getCode(location) {
    let params = qs.parse(URL.parse(location).query);
    return params.code;
}