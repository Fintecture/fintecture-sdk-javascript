const axios = require('axios');
const path = require('path');

const { FINTECTURESDKVERSION } = require('constants'); 
const { FINTECTUREAPIURL } = require('./URLBuilders/baseUrls');

require('dotenv').config({path: path.join(__dirname, '.env')});

const instance = axios.create({
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'Fintecture NodeJS SDK v' + FINTECTURESDKVERSION
    }, baseURL: FINTECTUREAPIURL
});

module.exports = instance;