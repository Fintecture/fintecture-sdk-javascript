import * as pjson from '../../package.json';

/**
 * @enum environment
 */

export enum environment {
  sandbox = "sandbox",
  production = "production"
}


/**
 * Project wide constants
 *
 * @class Constants
 */

export class Constants {
  public static readonly FINTECTURESDKVERSION: string = pjson.version;
  public static readonly DEFAULTENVIRONMENT: string = environment.sandbox;
  public static readonly SANDBOXENVIRONMENT: string = environment.sandbox;
  public static readonly PRODUCTIONENVIRONMENT: string = environment.production;
  public static readonly DECOUPLEDMODEL: string = 'decoupled';
  public static readonly SIGNEDHEADERPARAMETERLIST: string[] = ['(request-target)', 'Date', 'Digest', 'X-Request-ID'];
  public static readonly CONNECTHEADERPARAMETERLIST: string[] = ['Digest', 'X-Date', 'X-Request-ID'];
}
