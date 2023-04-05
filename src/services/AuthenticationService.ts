import axios from 'axios';
import { Constants } from '../utils/Constants';
import { BaseUrls } from '../utils/URLBuilders/BaseUrls';
import { IHttpConfig } from '../interfaces/ConfigInterface';

export const getInstance = (config: IHttpConfig) => {
  return axios.create({
    headers: {
      Accept: 'application/json',
      'User-Agent': `Fintecture NodeJS SDK v ${Constants.FINTECTURESDKVERSION}`,
      Authorization: `Basic ${config.clientToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    baseURL: config.env === Constants.SANDBOXENVIRONMENT ? BaseUrls.FINTECTUREOAUTHURL_SBX : BaseUrls.FINTECTUREOAUTHURL_PRD,
    timeout: config.timeout || 0,
  });
};
