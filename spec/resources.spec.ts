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
    let banks_data = '';

    const testaccounts_data = JSON.parse('{"data": [{"type":"testaccounts","id":1,"attributes":{"provider":"bbvaes","username":"078000000P"}, \ ' +
        '"attributes.credentials":{"password":"123456","username":"078000000P"}}]}');

    it('#providers(appId)', async function (done) {
        nock(baseURL, reqheaders).get(Endpoints.PROVIDERSURL).reply(200, banks_data);
        const body = await Fintecture.providers(appId);
        expect(body).toEqual(banks_data);
        done();
    });

    it('#providers(appId, providerId)', async function (done) {
        nock(baseURL, reqheaders).get(`${Endpoints.PROVIDERSURL}/agfbfr`).reply(200, banks_data);
        const body = await Fintecture.providers(appId, 'agfbfr');
        expect(body).toEqual(banks_data);
        done();
    });

    it('#testAccounts(appId)', async function (done) {
        nock(baseURL, reqheaders).get(Endpoints.TESTACCOUNTSURL).reply(200, testaccounts_data);
        const body = await Fintecture.testAccounts(appId);
        expect(body).toEqual(testaccounts_data);
        done();
    });

    it('#testAccounts(appId, testAccountId)', async function (done) {
        nock(baseURL, reqheaders).get(`${Endpoints.TESTACCOUNTSURL}/1`).reply(200, testaccounts_data);
        const body = await Fintecture.testAccounts(appId, 1);
        expect(body).toEqual(testaccounts_data);
        done();
    });
});