import { Endpoints } from './Endpoints';
import { BaseUrls } from'./BaseUrls';
import qs from 'qs';

export class ResourcesURLBuilder {

    static getAuthorizeFullURL(appId: string, redirectUri: string, state: any) {
        const queryString: string = `?${qs.stringify({
            app_id: appId,
            redirect_uri: redirectUri,
            state: state
        })}`;

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

    static getApplication(appId: string) {
        return `${BaseUrls.FINTECTUREAPIURL}${Endpoints.APPLICATIONURL}/${appId}`;
    }
}