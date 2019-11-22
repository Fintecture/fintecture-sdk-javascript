import path from 'path';
import dotenv from 'dotenv';
import qs from 'qs';

import { Authentication } from './../fintecture_client';
import { Endpoints } from './../src/utils/URLBuilders/Endpoints';
import { BaseUrls } from './../src/utils/URLBuilders/BaseUrls';

dotenv.config({path: path.join(__dirname, '.env')});

describe('Authentication', function () {
    const appId = process.env.app_id || '';
    const appSecret = process.env.app_secret || '';
    const redirectUri = process.env.redirect_uri || '';
    const state = 'somestate';
    const mockAuthUrl = BaseUrls.FINTECTUREOAUTHURL + Endpoints.OAUTHTOKENAUTHORIZE + '?' + qs.stringify({app_id: appId, redirect_uri: redirectUri, state: state });
    const authentication = new Authentication(appId);

    it('#authorize(authCode)', async function (done) {
        let authUrl = await authentication.getAuthorizeUrl(redirectUri, state);

        expect(authUrl).toEqual(mockAuthUrl);
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
        const tokens = await authentication.accessToken(appSecret);

        expect(typeof tokens).toEqual('object');
        done();
    });

    it('#accessToken(appSecret, authCode)', async function (done) {
        const tokens = await authentication.accessToken(appSecret, 'ais');

        expect(typeof tokens).toEqual('object');
        done();
    });
    
    it('#refreshToken(appSecret, refreshToken)', async function (done) {
        const tokens = await authentication.accessToken(appSecret);
        const refreshToken = tokens['refresh_token'];
        const refreshTokenResponse = await authentication.refreshToken(appId, refreshToken);

        expect(typeof refreshTokenResponse).toEqual('object');
        done();
    });
});