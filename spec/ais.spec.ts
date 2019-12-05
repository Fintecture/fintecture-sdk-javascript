import URL from 'url';
import qs from 'qs';
import request from 'request';

import { FintectureClient } from '../fintecture-client';
import { TestConfig } from './constants/config';

const AISproviderIdTest = process.env.PIS_PROVIDER_ID_TEST || 'cmcifr2a, cmbrfr, fegefr, procfr, cmmcfr';



describe(`AIS - get fintecture access token - `, function () {
    const client = new FintectureClient({ app_id: TestConfig.app_id_openbanking, app_secret: TestConfig.app_secret_openbanking });
    const redirectUri = TestConfig.app_redirect_uri_openbanking;
    const state = 'somestate';
    let accessToken;

    beforeEach(async function (done) {
        request({
            url: client.getAuthoritationUrl(redirectUri, state),
            headers: { 'Accept': 'application/json' },
            followRedirect: false
        }, async function (error, response, body) {
            let code = _getCode(response.headers['location']);
            const tokens: any = await client.getAccessToken(code);
            accessToken = tokens.access_token;
            done();
        });
    });

    AISproviderIdTest.split(',').forEach(function (providerId) {
        providerId = providerId.trim();

        it(`get provider ${providerId} AIS auth URL `, async function (done) {

            const response: any = await client.getProviderAuthUrl(accessToken, providerId);
            expect(response.status).toEqual(200);
            expect(response.data.url).toContain('http');
            done();
        });
    });
});

function _getCode(location) {
    let params = qs.parse(URL.parse(location).query);
    return params.code;
}