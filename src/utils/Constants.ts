import * as pjson from '../../package.json';

/**
 * Project wide constants
 *
 * @class Constants
 */

export class Constants {
  public static readonly FINTECTURESDKVERSION: string = pjson.version;
  public static readonly DEFAULTENVIRONMENT: string = 'sandbox';
  public static readonly SANDBOXENVIRONMENT: string = 'sandbox';
  public static readonly PRODUCTIONENVIRONMENT: string = 'production';
  public static readonly DECOUPLEDMODEL: string = 'decoupled';
  public static readonly SIGNEDHEADERPARAMETERLIST: string[] = ['(request-target)', 'Date', 'Digest', 'X-Request-ID'];
  public static readonly CONNECTHEADERPARAMETERLIST: string[] = ['Digest', 'X-Date', 'X-Request-ID'];
}
