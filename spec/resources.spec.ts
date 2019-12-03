import nock from 'nock';
import path from 'path';
import dotenv from 'dotenv';

import { Resources } from './../fintecture_client';
import { Endpoints } from './../src/utils/URLBuilders/Endpoints';

dotenv.config({path: path.join(__dirname, '.env')});

describe('Resources', function () {

    const resources = new Resources();
    const appId = process.env.app_id || '3f12a5c0-f719-4c14-9eac-08ed99290109';
    const baseURL = process.env.api_url || 'http://localhost:3000';
    const reqheaders = {
        reqheaders: {
            accept: 'application/json',
            app_id: appId
        },
    };
    let response_data = '';

    it('#providers(appId)', async function (done) {
        nock(baseURL, reqheaders).get(Endpoints.PROVIDERSURL).reply(200, response_data);
        const body = await resources.providers(appId);
        expect(body).toEqual(response_data);
        done();
    });

    it('#providers(appId, providerId)', async function (done) {
        nock(baseURL, reqheaders).get(`${Endpoints.PROVIDERSURL}/agfbfr`).reply(200, response_data);
        const body = await resources.providers(appId, 'agfbfr');
        expect(body).toEqual(response_data);
        done();
    });

    it('#testAccounts(appId)', async function (done) {
        nock(baseURL, reqheaders).get(Endpoints.TESTACCOUNTSURL).reply(200, response_data);
        const body = await resources.testAccounts(appId);
        expect(body).toEqual(response_data);
        done();
    });

    it('#testAccounts(appId, testAccountId)', async function (done) {
        nock(baseURL, reqheaders).get(`${Endpoints.TESTACCOUNTSURL}/1`).reply(200, response_data);
        const body = await resources.testAccounts(appId, 1);
        expect(body).toEqual(response_data);
        done();
    });

    it('#applications(appId)', async function(done){
        nock(baseURL, reqheaders).get(`${Endpoints.APPLICATIONURL}/${appId}`).reply(200, response_data);
        const body = await resources.applications(appId);
        expect(body).toEqual(response_data);
        done();
    });
});