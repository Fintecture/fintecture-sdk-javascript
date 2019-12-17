/**
 * Base URL constants
 *
 * @class BaseUrls
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export class BaseUrls {
  public static readonly FINTECTUREOAUTHURL_SBX: string =
    process.env.FINTECTUREOAUTHURL_DEV || 'https://oauth-sandbox.fintecture.com';
  public static readonly FINTECTUREAPIURL_SBX: string =
    process.env.FINTECTUREAPIURL_DEV || 'https://api-sandbox.fintecture.com';
  public static readonly FINTECTURECONNECTURL_SBX: string =
    process.env.FINTECTURECONNECTURL_DEV || 'https://connect-sandbox.fintecture.com';
  public static readonly FINTECTUREOAUTHURL_PRD: string =
    process.env.FINTECTUREOAUTHURL_DEV || 'https://oauth.fintecture.com';
  public static readonly FINTECTUREAPIURL_PRD: string =
    process.env.FINTECTUREAPIURL_DEV || 'https://api.fintecture.com';
  public static readonly FINTECTURECONNECTURL_PRD: string =
    process.env.FINTECTUREOAUTHURL_DEV || 'https://connect.fintecture.com';
}
