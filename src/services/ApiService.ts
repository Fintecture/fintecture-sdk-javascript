import axios from 'axios';
import URL from 'url';
import { Constants } from '../utils/Constants';
import { BaseUrls } from '../utils/URLBuilders/BaseUrls';
import * as Crypto from '../utils/Crypto';
import { Config } from '../interfaces/ConfigInterface';

export const getInstance = (env: string) => {
    return axios.create({
        headers : {
            'Accept': 'application/json',
            'User-Agent': 'Fintecture NodeJS SDK v' + Constants.FINTECTURESDKVERSION
        },
        baseURL: (env==Constants.SANDBOXENVIRONMENT)?BaseUrls.FINTECTUREAPIURL_SBX:BaseUrls.FINTECTUREAPIURL_PRD
    });
}

export const getHeaders = (method: string, url: string, accessToken: string, config: Config, body?: any) => {
    let headers = {
        'Accept': 'application/json',
        'User-Agent': 'Fintecture NodeJS SDK v' + Constants.FINTECTURESDKVERSION
    }

    if (accessToken)
        headers["Authorization"] = 'Bearer ' + accessToken;
    else
        headers["app_id"] = config.app_id;

    if (['post', 'put'].includes(method.toLowerCase()))
        headers["Content-Type"] = 'application/json';

    if (config.env == Constants.PRODUCTIONENVIRONMENT) {
        let payload = (typeof body == "string") ? body : JSON.stringify(body);
        let pathname = URL.parse(url).pathname;

        headers["Date"] = new Date().toUTCString();
        if (payload) headers["Digest"] = Crypto.hashBase64(payload);
        headers["X-Request-Id"] = Crypto.generateUUIDv4(); 
        headers["Signature"] = Crypto.createSignatureHeader(Object.assign({'(request-target)' : method.toLowerCase() + ' ' +pathname}, headers), config);
    }

    return headers;
};