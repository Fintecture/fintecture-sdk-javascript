import URL from 'url';
import qs from 'qs';
import request from 'request';

import { FintectureClient } from '../fintecture-client';
import { TestConfig } from './constants/config'

const AISproviderIdTest = process.env.AIS_PROVIDER_ID_TEST || 'cmmcfr';

describe('Authentication', () => {
    const redirectUri = TestConfig.appRedirectUri;
    const state = 'somestate';
    const clientOBanking = new FintectureClient({ app_id: TestConfig.appIdOpenbanking, app_secret: TestConfig.appSecretOpenbanking });
    const clientMerchant = new FintectureClient({ app_id: TestConfig.appIdMerchant, app_secret: TestConfig.appSecretMerchant });

    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    it('#accessToken()', async (done) => {
        const tokens: any = await clientOBanking.getAccessToken();
        expect(typeof tokens).toEqual('object');
        expect(typeof tokens.access_token).toEqual('string');
        done();
    });


    it('#accessToken(authCode) && #refreshToken(refreshToken)', async (done) => {

        const providerAuth: any = await clientOBanking.getProviderAuthUrl(null,AISproviderIdTest.split(',')[0], redirectUri);

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
                const customerId = params.customer_id;
                const code = params.code;
                const tokens:any = await clientOBanking.getAccessToken(code);

                const accessToken = tokens.access_token;
                const refreshToken = tokens.refresh_token;
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