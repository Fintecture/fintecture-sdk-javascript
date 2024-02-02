import axios from 'axios';
import * as URL from 'url';
import { Constants } from '../utils/Constants';
import { BaseUrls } from '../utils/URLBuilders/BaseUrls';
import * as Crypto from '../utils/Crypto';
import { IFintectureConfig, IHttpConfig } from '../interfaces/ConfigInterface';

export const getInstance = (config: IHttpConfig) => {
    return axios.create({
        headers: {
            Accept: 'application/json',
            'User-Agent': 'Fintecture NodeJS SDK v' + Constants.FINTECTURESDKVERSION,
        },
        baseURL:
            config.env === Constants.SANDBOXENVIRONMENT ? BaseUrls.FINTECTUREAPIURL_SBX : BaseUrls.FINTECTUREAPIURL_PRD,
        timeout: config.timeout || 0,
    });
};

export const getHeaders = (
    method: string,
    url: string,
    accessToken: string,
    config: IFintectureConfig,
    body?: any,
    extraHeaders?: any
) => {
    const headers = {
        Accept: 'application/json',
        'User-Agent': 'Fintecture NodeJS SDK v' + Constants.FINTECTURESDKVERSION,
    };

    if (accessToken) {
        headers['Authorization'] = 'Bearer ' + accessToken;
    } else {
        headers['app_id'] = config.app_id;
    }

    if (['post', 'put'].includes(method.toLowerCase())) {
        headers['Content-Type'] = 'application/json';
    }

    const payload = typeof body === 'string' ? body : JSON.stringify(body);
    const pathname = URL.parse(url).pathname;
    const search = URL.parse(url).search;

    if (body) {
        headers['Digest'] = 'SHA-256=' + Crypto.hashBase64(payload);
    }

    headers['Date'] = new Date().toUTCString();
    headers['X-Date'] = headers['Date'];
    headers['X-Request-ID'] = Crypto.generateUUIDv4();
    headers['(request-target)'] = method.toLowerCase() + ' ' + pathname + (search ? search : '');
    headers['Signature'] = Crypto.createSignatureHeader(headers, config, Constants.SIGNEDHEADERPARAMETERLIST);
    delete headers['(request-target)'];

    // Extend with extra headers in case they are not undefined. `undefined` as value of a header
    // is not allowed by Node.js
    if (extraHeaders) {
        Object.entries(extraHeaders).forEach(([headerName, headerValue]) => {
            if (headerValue !== undefined) {
                headers[headerName] = headerValue;
            }
        });
    }

    return headers;
};
