import { ResourcesURLBuilder } from './utils/URLBuilders/ResourcesURLBuilder';
import * as apiService from './services/ApiService';
import { eventNames } from 'cluster';
import { Constants } from './utils/Constants';

export class Resources {

    private axiosInstance;
    private appId;
    private config;

    constructor(config){
        this.axiosInstance = this._getAxiosInstance(config.env);
        this.appId = config.app_id;
        this.config = config;
    }

    async providers(providerId?: string) {

        this.axiosInstance.defaults.headers['app_id'] = this.appId;

        const response: any = await this.axiosInstance.get(ResourcesURLBuilder.getProviderURL(providerId));
        return response.data;
    }

    async testAccounts(testAccountId?: string){

        if (this.config.env==Constants.PRODUCTIONENVIRONMENT) throw new Error("testAccounts only available in sandbox");

        this.axiosInstance.defaults.headers['app_id'] = this.appId;

        const response: any = await this.axiosInstance.get(ResourcesURLBuilder.getTestAccountsURL(testAccountId));
        return response.data;
    }

    async application(){

        this.axiosInstance.defaults.headers['app_id'] = this.appId;

        const response: any = await this.axiosInstance.get(ResourcesURLBuilder.getApplication());
        return response.data;
    }

    _getAxiosInstance(env) {
        let axiosInstance = apiService.getInstance(env);
        return axiosInstance;
    }
}