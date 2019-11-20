"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var Constants_1 = require("../utils/Constants");
var BaseUrls_1 = require("../utils/URLBuilders/BaseUrls");
exports.instance = axios_1.default.create({
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'Fintecture NodeJS SDK v' + Constants_1.Constants.FINTECTURESDKVERSION
    }, baseURL: BaseUrls_1.BaseUrls.FINTECTUREAPIURL
});
//# sourceMappingURL=ApiService.js.map