import { ResourcesURLBuilder } from './utils/URLBuilders/ResourcesURLBuilder';
import * as apiService from './services/ApiService';
import { Constants } from './utils/Constants';
import { IFintectureConfig } from './interfaces/ConfigInterface';

export class Resources {
  private axiosInstance;
  private appId;
  private config;

  constructor(config) {
    this.axiosInstance = this._getAxiosInstance(config);
    this.appId = config.app_id;
    this.config = config;
  }

  public async providers(options) {
    this.axiosInstance.defaults.headers['app_id'] = this.appId;

    const response: any = await this.axiosInstance.get(ResourcesURLBuilder.getProviderURL(options));
    return response.data;
  }

  public async testAccounts(options) {
    if (this.config.env === Constants.PRODUCTIONENVIRONMENT) {
      throw new Error('testAccounts only available in sandbox');
    }

    this.axiosInstance.defaults.headers['app_id'] = this.appId;

    const response: any = await this.axiosInstance.get(ResourcesURLBuilder.getTestAccountsURL(options));
    return response.data;
  }

  public async application() {
    this.axiosInstance.defaults.headers['app_id'] = this.appId;

    const response: any = await this.axiosInstance.get(ResourcesURLBuilder.getApplication());
    return response.data;
  }

  private _getAxiosInstance(config: IFintectureConfig) {
    return apiService.getInstance({ env: config.env, timeout: config.timeout });
  }
}
