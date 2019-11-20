"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Endpoints_1 = require("./Endpoints");
var BaseUrls_1 = require("./BaseUrls");
var qs_1 = __importDefault(require("qs"));
var ResourcesURLBuilder = /** @class */ (function () {
    function ResourcesURLBuilder() {
    }
    ResourcesURLBuilder.getAuthorizeFullURL = function (appId, redirectUri, state) {
        var queryString = '';
        var query = {};
        if (appId)
            query['app_id'] = appId;
        if (redirectUri)
            query['redirect_uri'] = redirectUri;
        if (state)
            query['state'] = state;
        if (Object.entries(query).length > 0)
            queryString = "?" + qs_1.default.stringify(query);
        return "" + BaseUrls_1.BaseUrls.FINTECTUREOAUTHURL + Endpoints_1.Endpoints.OAUTHTOKENAUTHORIZE + queryString;
    };
    ResourcesURLBuilder.getProviderURL = function (providerID) {
        if (providerID) {
            return "" + BaseUrls_1.BaseUrls.FINTECTUREAPIURL + Endpoints_1.Endpoints.PROVIDERSURL + "/" + providerID;
        }
        else {
            return "" + BaseUrls_1.BaseUrls.FINTECTUREAPIURL + Endpoints_1.Endpoints.PROVIDERSURL;
        }
    };
    ResourcesURLBuilder.getTestAccountsURL = function (testAccountId) {
        if (testAccountId) {
            return "" + BaseUrls_1.BaseUrls.FINTECTUREAPIURL + Endpoints_1.Endpoints.TESTACCOUNTSURL + "/" + testAccountId;
        }
        else {
            return "" + BaseUrls_1.BaseUrls.FINTECTUREAPIURL + Endpoints_1.Endpoints.TESTACCOUNTSURL;
        }
    };
    ResourcesURLBuilder.getApplication = function (appId) {
        return "" + BaseUrls_1.BaseUrls.FINTECTUREAPIURL + Endpoints_1.Endpoints.APPLICATIONURL + "/" + appId;
    };
    return ResourcesURLBuilder;
}());
exports.ResourcesURLBuilder = ResourcesURLBuilder;
//# sourceMappingURL=ResourcesURLBuilder.js.map