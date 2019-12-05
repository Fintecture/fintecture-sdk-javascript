import URL from 'url';
import qs from 'qs';
import request from 'request';

import { FintectureClient } from '../fintecture-client';
import { TestConfig } from './constants/config'

describe('Authentication', function () {
    const redirectUri = TestConfig.app_redirect_uri_openbanking
    const state = 'somestate';
    const clientOBanking = new FintectureClient({ app_id: TestConfig.app_id_openbanking, app_secret: TestConfig.app_secret_openbanking });
    const clientMerchant = new FintectureClient({ app_id: TestConfig.app_id_merchant, app_secret: TestConfig.app_secret_merchant });
    let refreshToken: string;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    it('#authorize(redirectUri, state)', async function (done) {
        request({
            url: clientOBanking.getAuthoritationUrl(redirectUri, state),
            headers: { 'Accept': 'application/json' },
            followRedirect: false
        }, function (error, response, body) {
            let params = _getQueryParams(response.headers['location']);
            expect(response.statusCode).toEqual(302);
            expect(typeof params.code).toEqual('string');
            expect(params.state).toEqual(state);
            done();
        });
    });

    it('#accessToken()', async function (done) {
        const tokens: any = await clientOBanking.getAccessToken();
        expect(typeof tokens).toEqual('object');
        expect(typeof tokens.access_token).toEqual('string');
        done();
    });


    it('#accessToken(authCode)', async function (done) {
        request({
            url: clientMerchant.getAuthoritationUrl(redirectUri, state),
            headers: { 'Accept': 'application/json' },
            followRedirect: false
        }, async function (error, response, body) {
            let params = _getQueryParams(response.headers['location']);
            expect(response.statusCode).toEqual(302);
            expect(typeof params.code).toEqual('string');
            expect(params.state).toEqual(state);
            const tokens: any = await clientMerchant.getAccessToken(params.code);
            refreshToken = tokens.refresh_token;
            expect(typeof tokens).toEqual('object');
            expect(typeof tokens.refresh_token).toEqual('string');
            done();
        });

    });

    it('#refreshToken(refreshToken)', async function (done) {
        const refreshTokenResponse = await clientMerchant.refreshAccessToken(refreshToken);
        expect(typeof refreshTokenResponse).toEqual('object');
        done();
    });
});


function _getQueryParams(location) {
    return qs.parse(URL.parse(location).query);
}