"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Crypto_js_1 = require("./utils/Crypto.js");
var BaseUrls_1 = require("./utils/URLBuilders/BaseUrls");
var ApiService_1 = require("./services/ApiService");
var Connect = /** @class */ (function () {
    // public state: State;
    // public payload: Payload;
    // public data: Data;
    // public attributes: Attributes;
    // public meta: Meta;
    function Connect() {
        this.axios = ApiService_1.instance;
    }
    // getParam(interfaceName: string, paramName: string) {
    //     const allowedInterfaces = ['state', 'payload', 'data', 'attributes', 'meta'];
    //     if(!allowedInterfaces.includes(interfaceName)) throw Error("invalid target");
    //     if(!this[interfaceName].keys.includes(paramName)) this._trowInvalidParam(interfaceName, paramName);
    //     return this[interfaceName][paramName];
    // }
    /**
     * Generates a connect URL based on the payment parameters
     *
     * @param {payment} State
     */
    Connect.prototype.getConnectUrl = function (paymentParams) {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                this._validatePaymentIntegrity(paymentParams);
                if (!paymentParams.end_to_end_id)
                    paymentParams.end_to_end_id = this._generateEndToEndId();
                state = {
                    // app_id: this.app_id,
                    // app_secret: this.app_secret,
                    signature_type: 'rsa-sha256',
                    // signature: this._buildSignature(paymentParams, this.private_key, signature_type),
                    // redirect_uri: this.redirect_uri,
                    // origin_uri: this.origin_uri,
                    // state: this.state ? this.state: '',
                    payload: this._buildPayload(paymentParams)
                };
                return [2 /*return*/, BaseUrls_1.BaseUrls.FINTECTURECONNECTURL + "?state=" + state];
            });
        });
    };
    Connect.prototype.verifyUrlParameters = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, false];
            });
        });
    };
    Connect.prototype._validatePaymentIntegrity = function (paymentParams) {
        if (!paymentParams)
            this._trowInvalidPaymentPayload();
        if (!paymentParams.amount)
            this._trowInvalidPaymentPayload();
        if (!paymentParams.currency)
            this._trowInvalidPaymentPayload();
    };
    Connect.prototype._trowInvalidPaymentPayload = function () {
        throw Error("invalid payment payload");
    };
    Connect.prototype._trowInvalidParam = function (interfaceName, paramName) {
        throw Error("invalid " + paramName + " in " + interfaceName + " object");
    };
    Connect.prototype._generateEndToEndId = function () {
        return Crypto_js_1.generateUUID();
    };
    Connect.prototype._buildSignature = function (payment, privateKey, algorithm) {
        return Crypto_js_1.signPayload(payment, privateKey, algorithm);
    };
    Connect.prototype._buildPayload = function (payment) {
        var attributes = {
            amount: payment.amount,
        };
        var data = {
            type: "SEPA",
            attributes: attributes
        };
        return data;
    };
    return Connect;
}());
exports.Connect = Connect;
//# sourceMappingURL=Connect.js.map