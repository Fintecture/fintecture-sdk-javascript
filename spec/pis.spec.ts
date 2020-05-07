import { FintectureClient } from '../fintecture-client';
import * as UtilsCrypto from '../src/utils/Crypto';
import { BaseUrls } from '../src/utils/URLBuilders/BaseUrls';
import { TestConfig } from './constants/config';

const PISproviderIdTest = process.env.PIS_PROVIDER_ID_TEST || 'cmcifrpp, cmbrfr';
const paymentRedirectURI = "http://www.fintecture.com";

PISproviderIdTest.split(',').forEach( (providerId) => {

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

    describe(`Get the Bank response once the payment is done for ${providerId}`, () => {
        
        const client = new FintectureClient({ app_id: TestConfig.appIdOpenbanking, app_secret: TestConfig.appSecretOpenbanking, private_key: TestConfig.appPrivKeyOpenbanking });
        const state = 'somestate';
        let accessToken: string;
        let customerId: string;
        let sessionId: string;
        let url: string;
        let status: string;

        beforeEach(async (done) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            const token: any = await client.getAccessToken();
            accessToken = token.access_token;
            done();
        });

        it(`#prepare(dataPayload) + #getpayment`, async (done) => {
            const prepare: any = await client.preparePayment(accessToken, dataPayload());
            sessionId = prepare.meta.session_id;
            status = prepare.meta.status;
            expect(prepare.meta.code).toEqual(201);
            expect(typeof sessionId).toEqual('string');
            expect(typeof status).toEqual('string');
            const payment: any = await client.getPayments(accessToken, sessionId);
            expect(sessionId).toEqual(payment.meta.session_id);
            expect(status).toEqual(payment.meta.status);

            done();
        });

        it(`#initiate(providerId, dataPayload, paymentRedirectURI) for ${providerId}`, async (done) => {
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

        // it(`#putConfirm(customer_id: string, resource: Confirmation) for ${providerId}`, async (done) => {
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

    describe(`Get the Bank response once the payment is done with merchant account for  ${providerId}`, () => {
        beforeEach( () => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });

        it(`#initiate(providerId, dataPayload, paymentRedirectURI) for ${providerId}`, async (done) => {
            const client = new FintectureClient({ app_id: TestConfig.appIdMerchant, app_secret: TestConfig.appSecretMerchant, private_key: TestConfig.appPrivKeyMerchant });

            const token: any = await client.getAccessToken();
            
            const response: any = await client.paymentInitiate(token.access_token, providerId, dataPayloadMerchant(), paymentRedirectURI);
            expect(response.meta.code).toEqual(200);
            done();
        });

        it(`#initiate(providerId, dataPayload, paymentRedirectURI, state) for ${providerId}`, async (done) => {
            const client = new FintectureClient({ app_id: TestConfig.appIdMerchant, app_secret: TestConfig.appSecretMerchant, private_key: TestConfig.appPrivKeyMerchant });

            const token: any = await client.getAccessToken();
            
            const response: any = await client.paymentInitiate(token.access_token, providerId, dataPayloadMerchant(), paymentRedirectURI, 'state');
            expect(response.meta.code).toEqual(200);
            done();
        });
    });
});