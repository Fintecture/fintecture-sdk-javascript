import nock from 'nock';
import path from 'path';
import dotenv from 'dotenv';
import qs from 'qs';

import { Authentication } from './../fintecture_client';
import { Endpoints } from './../src/utils/URLBuilders/Endpoints';
import { BaseUrls } from './../src/utils/URLBuilders/BaseUrls';

dotenv.config({path: path.join(__dirname, '.env')});

describe('Authentication', function () {
    const authentication = new Authentication();
    const appId = process.env.app_id || '';
    const redirectUri = process.env.redirect_uri || '';
    const baseUrl = process.env.oauth_url || '';
    let code_url = '';
    const state = 'somestate';
    const mockAuthUrl = BaseUrls.FINTECTUREOAUTHURL + Endpoints.OAUTHTOKENAUTHORIZE + '?' + qs.stringify({app_id: appId, redirect_uri: redirectUri, state: state });
    const reqheaders = { reqheaders: { app_id: appId } };

    it('#authorize(app_id, redirect_uri, state)', async function (done) {
        const query = {response_type: 'code', app_id: appId, redirect_uri: redirectUri};
        nock(baseUrl, reqheaders).get(Endpoints.OAUTHTOKENAUTHORIZE).query(query).reply(302, undefined, {Location: code_url});
        let authUrl = await authentication.getAuthorizeUrl(appId, redirectUri, state);
        expect(authUrl).toEqual(mockAuthUrl);
        done();
    });

});