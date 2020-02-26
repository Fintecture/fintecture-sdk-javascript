import { AIS } from './src/Ais';
import { Authentication } from './src/Authentication';
import { IFintectureConfig } from './src/interfaces/ConfigInterface'
import { IPisConnect, IAisConnect } from './src/interfaces/connect/ConnectInterface'

import { Constants } from './src/utils/Constants';
import { Connect } from './src/Connect';
import { PIS } from './src/Pis';
import { Resources } from './src/Resources';
/**
 * Class responsible to centralize and dispatch all calls to the different Fintecture services
 *
 * @export
 * @class FintectureClient
 */
export class FintectureClient {

    private config: IFintectureConfig;
    private connect: Connect;
    private resources: Resources;
    private authentication: Authentication;
    private pis: PIS;
    private ais: AIS;

    /**
     * Create an instance of the fintecture client
     * @param {Object=} config - configuration parameters
     */
    constructor(config: object) {

        this.config = this._validateConfigIntegrity(config);

        this.connect = new Connect(this.config);
        this.resources = new Resources(this.config);
        this.authentication = new Authentication(this.config);
        this.pis = new PIS(this.config);
        this.ais = new AIS(this.config);
    }

    public async getAccessToken(authCode?: string, scopes?: string): Promise<object> {
        return this.authentication.accessToken(authCode, scopes);
    }

    public async refreshAccessToken(refreshToken: string): Promise<object> {
        return this.authentication.refreshToken(refreshToken);
    }

    public async getProviders(search?: object): Promise<object> {
        return this.resources.providers(search);
    }

    public async getApplication(): Promise<object> {
        return this.resources.application();
    }

    public async getTestAccounts(search?: object): Promise<object> {
        return this.resources.testAccounts(search);
    }

    public async getRedirectAuthUrl(accessToken: string, providerId: string, redirectUri: string, state?: string): Promise<object> {
        return this.ais.authorize(accessToken, providerId, redirectUri, state);
    }

    public async getDecoupledAuthUrl(accessToken: string, providerId: string, psuId: string, psuIpAddress): Promise<object> {
        return this.ais.authorize(accessToken, providerId, null, null, Constants.DECOUPLEDMODEL, psuId, psuIpAddress);
    }

    public async getDecoupledAuthStatus(accessToken: string, providerId: string, pollingId: string): Promise<object> {
        return this.ais.decoupled(accessToken, providerId, pollingId);
    }

    public async getAccounts(accessToken: string, customerId: string, search?: any, headers?: any): Promise<object> {
        return this.ais.getAccounts(accessToken, customerId, search, headers);
    }

    public async getTransactions(accessToken: string, customerId: string, accountId, search?: any, headers?: any): Promise<object> {
        return this.ais.getTransactions(accessToken, customerId, accountId, search, headers);
    }

    public async getAccountHolders(accessToken: string, customerId: string, search?: any, headers?: any): Promise<object> {
        return this.ais.getAccountHolders(accessToken, customerId, search, headers);
    }

    public async preparePayment(accessToken: string, payload: any): Promise<object> {
        return this.pis.prepare(accessToken, payload);
    }

    public async paymentInitiate(accessToken: string, providerId: string, payload: any, redirectUri: string, state?: string): Promise<object> {
        return this.pis.initiate(accessToken, providerId, payload, redirectUri, state);
    }

    public async paymentConfirmation(accessToken: string, customerId: string, sessionId: string): Promise<object> {
        return this.pis.confirm(accessToken, customerId, sessionId);
    }

    public async getPayments(accessToken: string, sessionId: string): Promise<object> {
        return this.pis.getPayments(accessToken, sessionId);
    }

    public async getPisConnect(accessToken: string, connectConfig: any): Promise<IPisConnect> {
        return this.connect.getPisConnect(accessToken, connectConfig);
    }

    public getAisConnect(accessToken: string, connectConfig: any): IAisConnect {
        return this.connect.getAisConnect(accessToken, connectConfig);
    }

    private _validateConfigIntegrity(config) {
        if (!config.app_id) {
            throw Error('app_id is not configured');
        }

        if (!config.app_secret) {
            throw Error('app_secret is not configured');
        }

        if (!config.private_key) {
            throw Error('private_key must be a string');
        }

        if (config.private_key && typeof config.private_key !== 'string') {
            throw Error('private_key must be a string');
        }

        if (config.private_key && !(config.private_key.indexOf('-----BEGIN PRIVATE KEY-----') >= 0)) {
            throw Error('private_key is in a wrong format');
        }

        if (config.private_key && !(config.private_key.indexOf('-----END PRIVATE KEY-----') >= 0)) {
            throw Error('private_key is in a wrong format');
        }

        if (config.env && !['sandbox', 'production'].includes(config.env)) {
            throw Error('environment is badly configured.');
        }

        if (!config.env) {
            config.env = Constants.DEFAULTENVIRONMENT;
        }

        return config as IFintectureConfig;
    }

}