/**
 * Project wide constants
 * 
 * @class Constants
 */

export class Constants {
    public static readonly FINTECTURESDKVERSION: string = '1.0.1';
    public static readonly DEFAULTENVIRONMENT: string = 'sandbox';
    public static readonly SANDBOXENVIRONMENT: string = 'sandbox';
    public static readonly PRODUCTIONENVIRONMENT: string = 'production';
    public static readonly SIGNEDHEADERPARAMETERLIST: string[] = ['(request-target)', 'Date', 'Digest', 'X-Request-Id'];
}