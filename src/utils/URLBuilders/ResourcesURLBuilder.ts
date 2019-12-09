import { Endpoints } from './Endpoints';
import { BaseUrls } from'./BaseUrls';
import qs from 'qs';

export class ResourcesURLBuilder {
    
    static getProviderURL(options?: object) {
        if (options && typeof options == 'object') {
            return `${BaseUrls.FINTECTUREAPIURL_SBX}${Endpoints.PROVIDERSURL}${options ? '?' + qs.stringify(options) : ''}`;
        } else {
            return `${BaseUrls.FINTECTUREAPIURL_SBX}${Endpoints.PROVIDERSURL}`;
        }
    }

    static getTestAccountsURL(options?: object) {
        if (options && typeof options == 'object') {
            return `${BaseUrls.FINTECTUREAPIURL_SBX}${Endpoints.TESTACCOUNTSURL}${options ? '?' + qs.stringify(options) : ''}`;
        } else {
            return `${BaseUrls.FINTECTUREAPIURL_SBX}${Endpoints.TESTACCOUNTSURL}`;
        }
    }

    static getApplication() {
        return `${BaseUrls.FINTECTUREAPIURL_SBX}${Endpoints.APPLICATIONURL}`;
    }
}