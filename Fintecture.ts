import { Authentication } from './src/Authentication';
import { Resources } from './src/Resources';
import { Connect } from './src/Connect';

export class Fintecture {

    static async getAuthorizeUrl(appId: string, redirectUri: string, state: any) {
        const authentication: Authentication = new Authentication();
        return authentication.getAuthorizeUrl(appId, redirectUri, state);
    }

    static async providers(appId: string, providerId?: string) {
        const resources: Resources = new Resources();
        return resources.providers(appId, providerId);
    }

    static async testAccounts(appId: string, testAccountId?: number){
        const resources: Resources = new Resources();
        return resources.testAccounts(appId, testAccountId);
    }

    static async applications(appId: string) {
        const resources: Resources = new Resources();
        return resources.applications(appId);
    }

    static async getConnectUrl(paymentsParams: any, type: string, appId: string, appSecret: string, privateKey: string, redirectUri: string, originUri: string, state?: string, version?: string){
        const connect: Connect = new Connect(appId, appSecret, privateKey, redirectUri, originUri, state, version);
        return connect.getConnectUrl(paymentsParams, type);
    }
}