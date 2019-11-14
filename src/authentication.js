const ResourcesURLBuilder = require('./utils/URLBuilders/ResourcesURLBuilder');
class Authentication {
    constructor(){
        this.axios = require('./utils/apiService');
    }

    async getAuthorizeUrl(app_id, redirect_uri, state) {
        return ResourcesURLBuilder.getAuthorizeFullURL(app_id, redirect_uri, state);
    }
}

module.exports = Authentication;