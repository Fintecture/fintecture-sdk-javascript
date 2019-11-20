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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nock_1 = __importDefault(require("nock"));
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
var Fintecture_1 = require("./../Fintecture");
var Endpoints_1 = require("./../src/utils/URLBuilders/Endpoints");
describe('Resources', function () {
    dotenv_1.default.config({ path: path_1.default.join(__dirname, '.env') });
    var appId = process.env.app_id || '';
    var baseURL = process.env.api_url || '';
    var reqheaders = {
        reqheaders: {
            accept: 'application/json',
            app_id: appId
        },
    };
    var response_data = '';
    it('#providers(appId)', function (done) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nock_1.default(baseURL, reqheaders).get(Endpoints_1.Endpoints.PROVIDERSURL).reply(200, response_data);
                        return [4 /*yield*/, Fintecture_1.Fintecture.providers(appId)];
                    case 1:
                        body = _a.sent();
                        expect(body).toEqual(response_data);
                        done();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('#providers(appId, providerId)', function (done) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nock_1.default(baseURL, reqheaders).get(Endpoints_1.Endpoints.PROVIDERSURL + "/agfbfr").reply(200, response_data);
                        return [4 /*yield*/, Fintecture_1.Fintecture.providers(appId, 'agfbfr')];
                    case 1:
                        body = _a.sent();
                        expect(body).toEqual(response_data);
                        done();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('#testAccounts(appId)', function (done) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nock_1.default(baseURL, reqheaders).get(Endpoints_1.Endpoints.TESTACCOUNTSURL).reply(200, response_data);
                        return [4 /*yield*/, Fintecture_1.Fintecture.testAccounts(appId)];
                    case 1:
                        body = _a.sent();
                        expect(body).toEqual(response_data);
                        done();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('#testAccounts(appId, testAccountId)', function (done) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nock_1.default(baseURL, reqheaders).get(Endpoints_1.Endpoints.TESTACCOUNTSURL + "/1").reply(200, response_data);
                        return [4 /*yield*/, Fintecture_1.Fintecture.testAccounts(appId, 1)];
                    case 1:
                        body = _a.sent();
                        expect(body).toEqual(response_data);
                        done();
                        return [2 /*return*/];
                }
            });
        });
    });
    it('#applications(appId)', function (done) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nock_1.default(baseURL, reqheaders).get(Endpoints_1.Endpoints.APPLICATIONURL + "/" + appId).reply(200, response_data);
                        return [4 /*yield*/, Fintecture_1.Fintecture.applications(appId)];
                    case 1:
                        body = _a.sent();
                        expect(body).toEqual(response_data);
                        done();
                        return [2 /*return*/];
                }
            });
        });
    });
});
//# sourceMappingURL=resources.spec.js.map