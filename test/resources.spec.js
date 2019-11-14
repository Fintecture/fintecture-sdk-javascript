const Fintecture = require('../fintecture');
const {PROVIDERSURL, TESTACCOUNTSURL} = require('../src/utils/URLBuilders/urls');
const nock = require('nock');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});

describe('Resources', function () {
    const banks_data = JSON.parse(`
        {
            "data" : [{
                    "type": "provider",
                    "id": "agfbfr",
                    "attributes": {
                        "provider": "agfbfr",
                        "name": "Allianz Banque",
                        "country": "FR",
                        "country_full": "France",
                        "ais": [
                            "Accounts",
                            "Transactions"
                        ],
                        "pis": [
                            "SEPA"
                        ],
                        "authentication_models": [
                            "redirect"
                        ],
                        "pis_account_selection": "aspsp",
                        "customer_types": [
                            "individual",
                            "corporate"
                        ]
                    }
                }]
        }`);

    const testaccounts_data = JSON.parse('{"data": [{"type":"testaccounts","id":1,"attributes":{"provider":"bbvaes","username":"078000000P"}, \ ' +
        '"attributes.credentials":{"password":"123456","username":"078000000P"}}]}');

    it('#providers()', async function (done) {
        nock(process.env.baseURL).get(PROVIDERSURL).reply(200, banks_data);
        const body = await Fintecture.providers();
        expect(body).toEqual(banks_data);
        done()
    });

    it('#providers(providerId)', async function (done) {
        nock(process.env.baseURL).get(`${PROVIDERSURL}/agfbfr`).reply(200, banks_data);
        const body = await Fintecture.providers('agfbfr');
        expect(body).toEqual(banks_data);
        done()
    });

    it('#testAccounts()', async function (done) {
        nock(process.env.baseURL).get(TESTACCOUNTSURL).reply(200, testaccounts_data);
        const body = await Fintecture.testAccounts();
        expect(body).toEqual(testaccounts_data);
        done()
    });

    it('#testAccounts(testAccountId)', async function (done) {
        nock(process.env.baseURL).get(`${TESTACCOUNTSURL}/1`).reply(200, testaccounts_data);
        const body = await Fintecture.testAccounts(1);
        expect(body).toEqual(testaccounts_data);
        done()
    });
});