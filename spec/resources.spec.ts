import path from 'path';
import dotenv from 'dotenv';

import { FintectureClient } from '../fintecture-client';
import { TestConfig } from './constants/config';

dotenv.config({path: path.join(__dirname, '.env')});

describe('Resources',  () => {

    const client = new FintectureClient({ app_id: TestConfig.appIdOpenbanking, app_secret: TestConfig.appSecretOpenbanking });

    it('#providers()', async (done) => {
        const body = await client.getProviders();
        expect(typeof body).toEqual('object');
        done();
    });

    it('#providers(options) PIS', async (done) => {
        const options = {
            'filter[pis]': 'sepa',
            'filter[country]': 'FR',
            'filter[psu_type]': 'retail',
            'sort[full_name]': 'asc'
        };

        const body = await client.getProviders(options);
        expect(typeof body).toEqual('object');
        done();
    });

    
    it('#providers(options) AIS', async (done) => {
        const options = {
            'filter[ais]': 'accounts',
            'filter[country]': 'FR',
            'filter[psu_type]': 'retail',
            'sort[full_name]': 'asc'
        };

        const body = await client.getProviders(options);
        expect(typeof body).toEqual('object');
        done();
    });

    it('#testAccounts()', async (done) => {
        const body = await client.getTestAccounts();
        expect(typeof body).toEqual('object');
        done();
    });

    it('#testAccounts(options)', async (done) => {
        const options = {
            'sort[provider]': 'asc'
        };

        const body = await client.getTestAccounts(options);
        expect(typeof body).toEqual('object');
        done();
    });

    it('#application()', async (done) => {
        const body = await client.getApplication();
        expect(typeof body).toEqual('object');
        done();
    });
});