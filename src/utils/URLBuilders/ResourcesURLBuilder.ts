import { Endpoints } from './Endpoints';
import qs from 'qs';

export class ResourcesURLBuilder {
    public static getProviderURL(options?: object) {
        if (options && typeof options === 'object') {
            return `${Endpoints.PROVIDERSURL}${options ? '?' + qs.stringify(options) : ''}`;
        } else {
            return `${Endpoints.PROVIDERSURL}`;
        }
    }

    public static getTestAccountsURL(options?: object) {
        if (options && typeof options === 'object') {
            return `${Endpoints.TESTACCOUNTSURL}${options ? '?' + qs.stringify(options) : ''}`;
        } else {
            return `${Endpoints.TESTACCOUNTSURL}`;
        }
    }

    public static getApplication() {
        return `${Endpoints.APPLICATIONURL}`;
    }
}
