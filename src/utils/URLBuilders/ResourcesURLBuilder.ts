import { Endpoints } from './Endpoints';
import { BaseUrls } from'./BaseUrls';

export class ResourcesURLBuilder {
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