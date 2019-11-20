import nock from 'nock';
import path from 'path';
import dotenv from 'dotenv';

import { Fintecture } from './../Fintecture';
import { Endpoints } from './../src/utils/URLBuilders/Endpoints';

describe('Resources', function () {

    dotenv.config({path: path.join(__dirname, '.env')});
    const appId = process.env.app_id || '';
    const baseURL = process.env.api_url || '';
    const reqheaders = {
        reqheaders: {
            accept: 'application/json',
            app_id: appId
        },
    };
    let response_data = '';

    it('#providers(appId)', async function (done) {
        nock(baseURL, reqheaders).get(Endpoints.PROVIDERSURL).reply(200, response_data);
        const body = await Fintecture.providers(appId);
        expect(body).toEqual(response_data);
        done();
    });

    it('#providers(appId, providerId)', async function (done) {
        nock(baseURL, reqheaders).get(`${Endpoints.PROVIDERSURL}/agfbfr`).reply(200, response_data);
        const body = await Fintecture.providers(appId, 'agfbfr');
        expect(body).toEqual(response_data);
        done();
    });

    it('#testAccounts(appId)', async function (done) {
        nock(baseURL, reqheaders).get(Endpoints.TESTACCOUNTSURL).reply(200, response_data);
        const body = await Fintecture.testAccounts(appId);
        expect(body).toEqual(response_data);
        done();
    });

    it('#testAccounts(appId, testAccountId)', async function (done) {
        nock(baseURL, reqheaders).get(`${Endpoints.TESTACCOUNTSURL}/1`).reply(200, response_data);
        const body = await Fintecture.testAccounts(appId, 1);
        expect(body).toEqual(response_data);
        done();
    });

    it('#applications(appId)', async function(done){
        nock(baseURL, reqheaders).get(`${Endpoints.APPLICATIONURL}/${appId}`).reply(200, response_data);
        const body = await Fintecture.applications(appId);
        expect(body).toEqual(response_data);
        done();
    });
});