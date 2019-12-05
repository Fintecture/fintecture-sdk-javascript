import axios from 'axios';
import { Constants } from '../utils/Constants';
import { BaseUrls } from '../utils/URLBuilders/BaseUrls';

export const getInstance = (env: string) => {
    return axios.create({
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Fintecture NodeJS SDK v' + Constants.FINTECTURESDKVERSION
        }, 
        baseURL: (env==Constants.SANDBOXENVIRONMENT)?BaseUrls.FINTECTUREAPIURL_SBX:BaseUrls.FINTECTUREAPIURL_PRD
    });
}