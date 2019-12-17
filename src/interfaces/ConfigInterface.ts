/**
 * Config configuration
 *
 * @interface Config
 */

export interface Config {
  app_id: string;
  app_secret: string;
  private_key: string;
  env?: string;
}
