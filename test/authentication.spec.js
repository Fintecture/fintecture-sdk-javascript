const nock = require('nock');
const path = require('path');
const qs = require('qs');

const Fintecture = require('../fintecture');
const {OAUTHTOKENAUTHORIZE} = require('../src/utils/URLBuilders/endpoints');

require('dotenv').config({path: path.join(__dirname, '.env')});

describe('Authentication', function () {

    const appId = process.env.appId
    const redirectUri = process.env.redirect_uri
    const state = 'somestate'
    const mockAuthUrl = OAUTHTOKENAUTHORIZE + '?' + qs.stringify({app_id: appId, redirect_uri: redirectUri, state: state })

    it('#authorize(app_id, redirect_uri, state)', async function (done) {
        nock(process.env.baseURL).get(OAUTHTOKENAUTHORIZE).reply(301, undefined, {Location: code_url});
        const authUrl = await Fintecture.authorize();
        console.log("=====> authUrl ", authUrl)
        console.log("=====> mockAuthUrl ", mockAuthUrl)
        expect(authUrl).toEqual(mockAuthUrl);
        done()
    });

});