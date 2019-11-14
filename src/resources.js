const ResourcesURLBuilder = require('./utils/URLBuilders/ResourcesURLBuilder');
class Resources {
    constructor(){
        this.axios = require('./utils/apiService');
    }

    async providers(appId, providerId) {
        const response = await this.axios.get(ResourcesURLBuilder.getProviderURL(providerId), {headers: {app_id: appId}});
        return response.data
    }

    async testAccounts(appId, testAccountId){
        const response = await this.axios.get(ResourcesURLBuilder.getTestAccountsURL(testAccountId), {headers: {app_id: appId}});
        return response.data
    }

    async applications(appId){
        const response = await this.axios.get(ResourcesURLBuilder.getApplication(appId), {headers: {app_id: appId}});
        return response.data
    }
}

module.exports = Resources;