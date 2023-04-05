/**
 * Config configuration
 *
 * @interface IFintectureConfig
 */

import { environment } from '../utils/Constants';

export interface IFintectureConfig {
  app_id: string;
  app_secret: string;
  private_key: string;
  env?: environment;
  timeout?: number;
}

export interface IHttpConfig {
  env: environment;
  clientToken?: string;
  timeout?: number;
}
