import { Endpoints } from './Endpoints';
import { BaseUrls } from './BaseUrls';
import qs from 'qs';

export class ResourcesURLBuilder {
  static getProviderURL(options?: object) {
    if (options && typeof options == 'object') {
      return `${Endpoints.PROVIDERSURL}${options ? '?' + qs.stringify(options) : ''}`;
    } else {
      return `${Endpoints.PROVIDERSURL}`;
    }
  }

  static getTestAccountsURL(options?: object) {
    if (options && typeof options == 'object') {
      return `${Endpoints.TESTACCOUNTSURL}${options ? '?' + qs.stringify(options) : ''}`;
    } else {
      return `${Endpoints.TESTACCOUNTSURL}`;
    }
  }

  static getApplication() {
    return `${Endpoints.APPLICATIONURL}`;
  }
}
