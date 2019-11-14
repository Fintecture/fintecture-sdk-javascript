const Authentication = require('./src/authentication');
const Resources = require('./src/resources');

class Fintecture {

    static async getAuthorizeUrl(app_id, redirect_uri, state) {
        return new Authentication().getAuthorizeUrl(app_id, redirect_uri, state);
    }

    static async providers(providerId) {
        return new Resources().providers(providerId);
    }

    static async testAccounts(testAccountId){
        return new Resources().testAccounts(testAccountId);
    }
}

module.exports = Fintecture;