import path from 'path';
import dotenv from 'dotenv';
const url = require('url');
import qs from 'qs';

import { Authentication } from './../fintecture_client';

dotenv.config({path: path.join(__dirname, '.env')});

const appId = process.env.app_id || '3f12a5c0-f719-4c14-9eac-08ed99290109';
const appSecret = process.env.app_secret || '93ea0128-8258-4b1d-9109-b4899a98677b';
const appIdMerchant = process.env.merchant_app_id_test || '1b96c253-1944-4986-a467-df2152ddffdb';
const appSecretMerchant = process.env.merchant_app_secret_test || 'f03fec5f-4d38-437f-914d-817337550fab';
const pisProviderIdTest = process.env.PIS_PROVIDER_ID_TEST || 'cmcifr2a, cmbrfr, fegefr, procfr, cmmcfr';

describe('Authentication', function () {
    const redirectUri = process.env.redirect_uri || 'https://www.fintecture.com';
    const state = 'somestate';
    const authentication = new Authentication(appId);
    const merchantAuthentication = new Authentication(appIdMerchant);
    let refreshToken: string;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    it('#authorize(redirectUri, state)', async function (done) {
        const response: any = await authentication.authorize(redirectUri, state);
        const code = _getCode(response)

        expect(response.status).toEqual(200);
        expect(typeof code).toEqual('string');
        done();
    });

    it('#accessToken()', async function (done) {
        let errorMessage = 'No error thrown.';

        try {
            await authentication.accessToken('');
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('invalid appSecret parameter');
        done();
    });

    it('#accessToken(appSecret)', async function (done) {
        const tokens: any = await authentication.accessToken(appSecret);

        expect(typeof tokens).toEqual('object');

        expect(typeof tokens.access_token).toEqual('string');
        done();
    });


    it('#accessToken(appSecret, authCode)', async function (done) {
        const response: any = await merchantAuthentication.authorize(redirectUri, state);
        const tokens: any = await merchantAuthentication.accessToken(appSecretMerchant, _getCode(response));

        refreshToken = tokens.refresh_token;

        expect(typeof tokens).toEqual('object');
        expect(typeof tokens.refresh_token).toEqual('string');
        done();
    });
    
    it('#refreshToken(appSecret, refreshToken)', async function (done) {
        const refreshTokenResponse = await merchantAuthentication.refreshToken(appSecretMerchant, refreshToken);

        expect(typeof refreshTokenResponse).toEqual('object');
        done();
    });
});

pisProviderIdTest.split(',').forEach(function (providerId) {
    providerId = providerId.trim();

    describe(`Get Bank Authentication URL (STEP 3) for ${providerId}`, function () {
        const authentication = new Authentication(appId);
        const redirectUri = process.env.redirect_uri || 'https://www.fintecture.com';
        const state = 'somestate';

        let accessToken;

        beforeEach(async function (done) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
            const response: any = await authentication.authorize(redirectUri, state);
            const tokens: any = await authentication.accessToken(appSecret, _getCode(response));
            accessToken = tokens.access_token;
            done();
        });

        it('returns the provider auth URL', async function (done) {
            accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzI3LCJhcHBfZXh0X2lkIjoiM2YxMmE1YzAtZjcxOS00YzE0LTllYWMtMDhlZDk5MjkwMTA5IiwiYXBwX3NlY3JldCI6IjkzZWEwMTI4LTgyNTgtNGIxZC05MTA5LWI0ODk5YTk4Njc3YiIsImFwcF9uYW1lIjoiVGVzdCBBcHAiLCJhcHBfY2xpZW50X2lkIjoiOGlIODV0Nk5QamRhcVdVak1HSlJSSHE5dFdWMiIsImNsaWVudF9iZW5lZmljaWFyeV9pZCI6bnVsbCwiYXBwX2Rlc2NyaXB0aW9uIjoiQXBwIGZvciB0ZXN0aW5nLiBEb24ndCBkZWxldGUgaXQhISIsImFwcF9lbnZpcm9ubWVudCI6InNhbmRib3giLCJhcHBfc2NvcGVfYWlzIjp0cnVlLCJhcHBfc2NvcGVfcGlzIjp0cnVlLCJhcHBfc2NvcGVfY29sbGVjdGlvbiI6ZmFsc2UsImFwcF9wdWJsaWNfa2V5IjoiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBbmhLSEJybDZmUUFQaC8vS05uc1VcblVaQXJGT1BZZkFqbExncll4eVlCQytGcy9aaW05YldlOFBjc3dXR2ZyOGprakd6QmFITHlCMlVHbkxxZFhHRitcbnZ1U2YxM0IvRUF5VWFuNnYzYS8vOThUTUdCL3NSUVZTL0VlZ3VoNkludDdLTU9NZFpQb29UaUdma0REcUEwMGZcbm5VajUxcTJJOHlpMnVxeEVpUjVRYTgwT1VJS3ZDcDhKb2lKNUV6R2F0WDhqbU5Id1UzU2JvcEsrLzhSSjBBWmVcbk9ELzRLa014SG9rdXBEck1LRjFaK1E0VUZFc2tFakgwNXE0YnJNSjNQMUhlWDJnVzBNOVdYb0xEWEhtT2t1djJcbi9QWlNPTDNJK2tncm03ZzFsQkNGYUo0TDRveGRlS2Y4djFDRk5NdFNiVUxDditiWnJValc2QXB6VFpMaWdOTy9cbmN3SURBUUFCXG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iLCJhcHBfY21zIjpudWxsLCJhcHBfdXJsIjpudWxsLCJhcHBfcmV0dXJuX3VyaSI6bnVsbCwiYXBwX2xvZ28iOiIuLy4uLy4uLy4uLy4uL2Fzc2V0cy9pbWcvaWNvbl9tb25vY2hyb21lLnBuZyIsImlzX2RlbGV0ZWQiOmZhbHNlLCJjcmVhdGVkX2F0IjoiMjAxOS0wOC0yMVQxMTo1NTozMy4wMDBaIiwidXBkYXRlZF9hdCI6IjIwMTktMTEtMjFUMTM6MjQ6MTEuMDAwWiIsInRpbWVzdGFtcCI6IjIwMTktMTItMDJUMTI6NTg6NDkuNDM5WiIsImlhdCI6MTU3NTI5MTUyOSwiZXhwIjoxNTc1Mzc3OTI5fQ.urhDXrRA-ULh-7OpcDavqZYTOUIl7rHl1vyEW3FeSuQ';
            const response: any = await authentication.authenticate(accessToken, providerId);

            expect(response.status).toEqual(200);
            done();
        });
    });
});

function _getCode(response) {
    let params = qs.parse(url.parse(`example.com${response.request.path}`).query);
    return params.code;
}