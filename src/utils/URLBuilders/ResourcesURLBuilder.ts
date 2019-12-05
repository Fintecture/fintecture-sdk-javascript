import { Endpoints } from './Endpoints';
import { BaseUrls } from'./BaseUrls';

export class ResourcesURLBuilder {
    static getProviderURL(providerID?: string) {
        if (providerID) {
            return `${BaseUrls.FINTECTUREAPIURL_SBX}${Endpoints.PROVIDERSURL}/${providerID}`;
        } else {
            return `${BaseUrls.FINTECTUREAPIURL_SBX}${Endpoints.PROVIDERSURL}`;
        }
    }

    static getTestAccountsURL(testAccountId?: string) {
        if (testAccountId) {
            return `${BaseUrls.FINTECTUREAPIURL_SBX}${Endpoints.TESTACCOUNTSURL}/${testAccountId}`;
        } else {
            return `${BaseUrls.FINTECTUREAPIURL_SBX}${Endpoints.TESTACCOUNTSURL}`;
        }
    }

    static getApplication() {
        return `${BaseUrls.FINTECTUREAPIURL_SBX}${Endpoints.APPLICATIONURL}`;
    }
}