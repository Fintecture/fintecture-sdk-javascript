const {OAUTHTOKENAUTHORIZE, PROVIDERSURL, TESTACCOUNTSURL} = require('./endpoints');
const {FINTECTUREOAUTHURL} = require('./baseUrls')
const qs = require('qs');

class ResourcesURLBuilder {

    static getAuthorizeFullURL(app_id, redirect_uri, state) {
        let queryString = qs.stringify({
            app_id: app_id,
            redirect_uri: redirect_uri,
            state: state
        })
        return `${FINTECTUREOAUTHURL}/${OAUTHTOKENAUTHORIZE}?${queryString}`;
    }

    static getProviderURL(providerID) {
        if (providerID) {
            return `${PROVIDERSURL}/${providerID}`;
        } else {
            return `${PROVIDERSURL}`;
        }
    }

    static getTestAccountsURL(testAccountId) {
        if (testAccountId) {
            return `${TESTACCOUNTSURL}/${testAccountId}`;
        } else {
            return `${TESTACCOUNTSURL}`;
        }
    }

    static getTestAccountsURL(applications) {
        return `${TESTACCOUNTSURL}/${testAccountId}`;
    }
}

module.exports = ResourcesURLBuilder;
