import path from 'path';
import dotenv from 'dotenv';

import { FintectureClient } from '../fintecture-client';
import * as UtilsCrypto from '../src/utils/Crypto';
import { BaseUrls } from '../src/utils/URLBuilders/BaseUrls';
import { TestConfig } from './constants/config';

dotenv.config({path: path.join(__dirname, '.env')});

const appId = process.env.app_id || '3f12a5c0-f719-4c14-9eac-08ed99290109';
const appSecret = process.env.app_secret || '93ea0128-8258-4b1d-9109-b4899a98677b';
const merchantAppID = process.env.merchant_app_id_test || '1b96c253-1944-4986-a467-df2152ddffdb';
const merchantAppSecret = process.env.merchant_app_secret_test || 'f03fec5f-4d38-437f-914d-817337550fab';
const PISproviderIdTest = process.env.PIS_PROVIDER_ID_TEST || 'cmcifr2a, cmbrfr, fegefr, procfr, cmmcfr';
const successCallbackURL = BaseUrls.FINTECTUREAPIURL_SBX + '/provider/[provider_id]/auth/callback/success?state=[session_id]&psuAF=666'
const errorCallbackURL = BaseUrls.FINTECTUREAPIURL_SBX + '/provider/[provider_id]/auth/callback/error?state=[session_id]'

const paymentRedirectURI = "http://www.fintecture.com";

PISproviderIdTest.split(',').forEach(function (providerId) {

    function dataPayload() {
        return {
            data: {
                type: "PIS",
                attributes: {
                    amount: 1,
                    currency: "EUR",
                    communication: "KEEP YOUR DIRTY MONEY",
                    end_to_end_id: UtilsCrypto.generateUUID(),
                    beneficiary : {
                        name : "Bob Smith",
                        address : "8 road of somewhere, 80330 Lisboa",
                        country : "ES",
                        iban : "PT07BARC20325388680799",
                        swift_bic: "DEUTPTFF"
                    }
                }
            }
        }
    }

    function dataPayloadMerchant() {
        return {
            data: {
                type: "PIS",
                attributes: {
                    amount: 1,
                    currency: "EUR",
                    communication: "KEEP YOUR DIRTY MONEY",
                    end_to_end_id: UtilsCrypto.generateUUID()
                }
            }
        }
    }

    providerId = providerId.trim();

    describe(`Get the Bank response once the payment is done for ${providerId}`, function () {
        
        const client = new FintectureClient({ app_id: TestConfig.app_id_openbanking, app_secret: TestConfig.app_secret_openbanking });
        const state = 'somestate';
        let accessToken: string;
        let successfulReportUrl: string;
        let unsuccessfulReportUrl: string;
        let customerId: string;
        let sessionId: string;
        let url: string;
        let status: string;

        beforeEach(async function (done) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            const token: any = await client.getAccessToken();
            accessToken = token.access_token;
            done();
        });

        it(`#initiate(providerId, dataPayload, paymentRedirectURI) for ${providerId}`, async function (done) {
            const response: any = await client.paymentInitiate(accessToken, providerId, dataPayload(), paymentRedirectURI, state);
            customerId = response.meta.customer_id;
            sessionId = response.meta.session_id;
            status = response.meta.status;
            url = response.meta.url;
            expect(response.meta.code).toEqual(200);
            expect(typeof customerId).toEqual('string');
            expect(typeof sessionId).toEqual('string');
            expect(typeof status).toEqual('string');
            expect(typeof url).toEqual('string');
            done();
        });

        // it(`#putConfirm(customer_id: string, resource: Confirmation) for ${providerId}`, async function (done) {
        //     const resource: Confirmation = {
        //         meta: {
        //             session_id: sessionId
        //         }
        //     }
        //     const response = await pis.putConfirm(customerId, resource);
        //     expect(response.status).toBeCloseTo(202, 201);
        //     done();
        // });
    });

    describe(`Get the Bank response once the payment is done with merchant account for  ${providerId}`, function () {
        beforeEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });

        it(`#initiate(providerId, dataPayload, paymentRedirectURI) for ${providerId}`, async function (done) {
            const client = new FintectureClient({ app_id: TestConfig.app_id_merchant, app_secret: TestConfig.app_secret_merchant });

            const token: any = await client.getAccessToken();
            
            const response: any = await client.paymentInitiate(token.access_token, providerId, dataPayloadMerchant(), paymentRedirectURI);
            expect(response.meta.code).toEqual(200);
            done();
        });

        it(`#initiate(providerId, dataPayload, paymentRedirectURI, state) for ${providerId}`, async function (done) {
            const client = new FintectureClient({ app_id: TestConfig.app_id_merchant, app_secret: TestConfig.app_secret_merchant });

            const token: any = await client.getAccessToken();
            
            const response: any = await client.paymentInitiate(token.access_token, providerId, dataPayloadMerchant(), paymentRedirectURI, 'state');
            expect(response.meta.code).toEqual(200);
            done();
        });
    });
});