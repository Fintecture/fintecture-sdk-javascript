import { ResourcesURLBuilder } from './utils/URLBuilders/ResourcesURLBuilder';
import { instance as AuthServiceAxios } from './services/AuthService';

export class Authentication {

    public axios: any;

    constructor(){
        this.axios = AuthServiceAxios;
    }

    async getAuthorizeUrl(appId: string, redirectUri: string, state: any) {
        return ResourcesURLBuilder.getAuthorizeFullURL(appId, redirectUri, state);
    }
}