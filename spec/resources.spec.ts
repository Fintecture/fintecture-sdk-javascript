import nock from 'nock';
import path from 'path';
import dotenv from 'dotenv';

import { FintectureClient } from '../fintecture-client';
import { Endpoints } from './../src/utils/URLBuilders/Endpoints';
import { TestConfig } from './constants/config';
import { BaseUrls } from './../src/utils/URLBuilders/BaseUrls';

dotenv.config({path: path.join(__dirname, '.env')});

describe('Resources', function () {

    const client = new FintectureClient({ app_id: TestConfig.app_id_openbanking, app_secret: TestConfig.app_secret_openbanking });

    it('#providers()', async function (done) {
        const body = await client.getProviders();
        expect(typeof body).toEqual('object');
        done();
    });

    it('#providers(providerId)', async function (done) {
        const body = await client.getProviders('agfbfr');
        expect(typeof body).toEqual('object');
        done();
    });

    it('#testAccounts()', async function (done) {
        const body = await client.getTestAccounts();
        expect(typeof body).toEqual('object');
        done();
    });

    it('#testAccounts(testAccountId)', async function (done) {
        const body = await client.getTestAccounts('1');
        expect(typeof body).toEqual('object');
        done();
    });

    it('#application()', async function(done){
        const body = await client.getApplication();
        expect(typeof body).toEqual('object');
        done();
    });
});