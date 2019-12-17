import axios from 'axios';
import { Constants } from '../utils/Constants';
import { BaseUrls } from '../utils/URLBuilders/BaseUrls';

export const getInstance = (env: string) => {
  return axios.create({
    baseURL:
      env === Constants.SANDBOXENVIRONMENT ? BaseUrls.FINTECTURECONNECTURL_SBX : BaseUrls.FINTECTURECONNECTURL_PRD,
  });
};
