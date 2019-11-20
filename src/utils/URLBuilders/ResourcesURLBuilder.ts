import { Endpoints } from './Endpoints';
import { BaseUrls } from'./BaseUrls';
import qs from 'qs';

export class ResourcesURLBuilder {

    static getAuthorizeFullURL(appId: string, redirectUri?: string, state?: any) {
        let queryString: string = '';
        let query: any = {};

        if(appId) query['app_id'] = appId;
        if(redirectUri) query['redirect_uri'] = redirectUri;
        if(state) query['state'] = state;

        if(Object.entries(query).length > 0) queryString = `?${qs.stringify(query)}`;

        return `${BaseUrls.FINTECTUREOAUTHURL}${Endpoints.OAUTHTOKENAUTHORIZE}${queryString}`;
    }

    static getProviderURL(providerID?: string) {
        if (providerID) {
            return `${BaseUrls.FINTECTUREAPIURL}${Endpoints.PROVIDERSURL}/${providerID}`;
        } else {
            return `${BaseUrls.FINTECTUREAPIURL}${Endpoints.PROVIDERSURL}`;
        }
    }

    static getTestAccountsURL(testAccountId?: number) {
        if (testAccountId) {
            return `${BaseUrls.FINTECTUREAPIURL}${Endpoints.TESTACCOUNTSURL}/${testAccountId}`;
        } else {
            return `${BaseUrls.FINTECTUREAPIURL}${Endpoints.TESTACCOUNTSURL}`;
        }
    }

    static getApplication(appId?: string) {
        if (appId) {
            return `${BaseUrls.FINTECTUREAPIURL}${Endpoints.APPLICATIONURL}/${appId}`;
        } else {
            return `${BaseUrls.FINTECTUREAPIURL}${Endpoints.APPLICATIONURL}`;
        }
    }
}