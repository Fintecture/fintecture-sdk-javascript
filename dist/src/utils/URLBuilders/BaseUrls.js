"use strict";
/**
 * Base URL constants
 *
 * @class BaseUrls
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '.env') });
var BaseUrls = /** @class */ (function () {
    function BaseUrls() {
    }
    BaseUrls.FINTECTUREOAUTHURL = process.env.oauth_url || 'https://api.fintecture.com';
    BaseUrls.FINTECTUREAPIURL = process.env.api_url || 'https://api.fintecture.com';
    BaseUrls.FINTECTURECONNECTURL = process.env.connect_url || 'https://connect.fintecture.com';
    return BaseUrls;
}());
exports.BaseUrls = BaseUrls;
//# sourceMappingURL=BaseUrls.js.map