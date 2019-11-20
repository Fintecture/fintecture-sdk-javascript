import { ResourcesURLBuilder } from './utils/URLBuilders/ResourcesURLBuilder';
import { instance as ApiServiceAxios } from './services/ApiService';

export class Resources {

    public axios;

    constructor(){
        this.axios = ApiServiceAxios;
    }

    async providers(appId: string, providerId?: string) {
        const response: any = await this.axios.get(ResourcesURLBuilder.getProviderURL(providerId), {headers: {app_id: appId, Accept: 'application/json'}});
        return response.data;
    }

    async testAccounts(appId: string, testAccountId?: number){
        const response: any = await this.axios.get(ResourcesURLBuilder.getTestAccountsURL(testAccountId), {headers: {app_id: appId}});
        return response.data;
    }

    async applications(appId: string){
        const response: any = await this.axios.get(ResourcesURLBuilder.getApplication(appId), {headers: {app_id: appId}});
        return response.data;
    }
}