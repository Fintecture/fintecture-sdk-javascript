import axios from 'axios';
import { Constants } from '../utils/Constants'; 
import { BaseUrls } from '../utils/URLBuilders/BaseUrls';

export const instance = axios.create({
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'Fintecture NodeJS SDK v' + Constants.FINTECTURESDKVERSION
    }, baseURL: BaseUrls.FINTECTUREAPIURL
});