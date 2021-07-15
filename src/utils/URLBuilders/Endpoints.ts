/**
 * Endpoints constants
 *
 * @class Endpoints
 */

export class Endpoints {
  public static readonly OAUTHTOKENAUTHORIZE: string = '/oauth/token/authorize';
  public static readonly OAUTHACCESSTOKEN: string = '/oauth/accesstoken';
  public static readonly OAUTHREFRESHTOKEN: string = '/oauth/refreshtoken';
  public static readonly PROVIDERSURL: string = '/res/v1/providers';
  public static readonly TESTACCOUNTSURL: string = '/res/v1/testaccounts';
  public static readonly APPLICATIONURL: string = '/res/v1/application';
  public static readonly PISPROVIDER: string = '/pis/v1/provider';
  public static readonly PISCUSTOMER: string = '/pis/v1/customer';
  public static readonly PIS: string = '/pis/v1';
  public static readonly AISPROVIDER: string = '/ais/v1/provider';
  public static readonly AISCUSTOMER: string = '/ais/v1/customer';
  public static readonly AISCONNECT: string = '/ais/v2/connect';
  public static readonly PISCONNECT: string = '/pis/v2/connect';
}
