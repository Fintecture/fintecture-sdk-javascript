import URL from 'url';
import qs from 'qs';
import request from 'request';

import { FintectureClient } from '../fintecture-client';
import { TestConfig } from './constants/config'

const AISproviderIdTest = process.env.AIS_PROVIDER_ID_TEST || 'cmmcfr';

describe('Authentication', function () {
    const redirectUri = TestConfig.app_redirect_uri;
    const state = 'somestate';
    const clientOBanking = new FintectureClient({ app_id: TestConfig.app_id_openbanking, app_secret: TestConfig.app_secret_openbanking });
    const clientMerchant = new FintectureClient({ app_id: TestConfig.app_id_merchant, app_secret: TestConfig.app_secret_merchant });

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    it('#accessToken()', async function (done) {
        const tokens: any = await clientOBanking.getAccessToken();
        expect(typeof tokens).toEqual('object');
        expect(typeof tokens.access_token).toEqual('string');
        done();
    });


    it('#accessToken(authCode) && #refreshToken(refreshToken)', async function (done) {

        let providerAuth: any = await clientOBanking.getProviderAuthUrl(null,AISproviderIdTest.split(',')[0], redirectUri);

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
                let customerId = params.customer_id;
                let code = params.code;
                let tokens:any = await clientOBanking.getAccessToken(code);

                let accessToken = tokens.access_token;
                let refreshToken = tokens.refresh_token;
                expect(!!accessToken).toBe(true);
                expect(!!customerId).toBe(true);

                const refreshTokenResponse = await clientOBanking.refreshAccessToken(refreshToken);
                expect(typeof refreshTokenResponse).toEqual('object');
                done();


            });
        });
    });
});


function _getQueryParams(location) {
    return qs.parse(URL.parse(location).query);
}