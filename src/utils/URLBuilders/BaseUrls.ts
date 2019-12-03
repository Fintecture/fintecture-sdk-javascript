/**
 * Base URL constants
 * 
 * @class BaseUrls
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(__dirname, '.env')});

export class BaseUrls {
   public static readonly FINTECTUREOAUTHURL: string = process.env.oauth_url || 'http://localhost:3000';
   public static readonly FINTECTUREAPIURL: string = process.env.api_url || 'http://localhost:3000';
   public static readonly FINTECTURECONNECTURL: string = process.env.connect_url || 'https://connect.fintecture.com';
}