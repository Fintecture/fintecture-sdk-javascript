/**
 * Config configuration
 *
 * @interface IConfig
 */

export interface IConfig {
  app_id: string;
  app_secret: string;
  private_key: string;
  env?: string;
}
