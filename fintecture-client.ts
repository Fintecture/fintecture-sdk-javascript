import { Constants } from './src/utils/Constants';
import { Connect } from './src/Connect';
import { Resources } from './src/Resources';
import { Authentication } from './src/Authentication';
import { PIS } from './src/PIS';
import { AIS } from './src/AIS';
import { Config } from './src/interfaces/ConfigInterface'
/**
 * Class responsible to centralize and dispatch all calls to the different Fintecture services
 *
 * @export
 * @class FintectureClient
 */
export class FintectureClient {

    config: Config;
    connect: Connect;
    resources: Resources;
    authentication: Authentication;
    pis: PIS;
    ais: AIS;

    /**
     * Create an instance of the fintecture client
     * @param {Object=} config - configuration parameters
     */
    constructor(config: Object) {

        this.config = this._validateConfigIntegrity(config);

        this.connect = new Connect(this.config);
        this.resources = new Resources(this.config);
        this.authentication = new Authentication(this.config);
        this.pis = new PIS(this.config);
        this.ais = new AIS(this.config);
    }

    getAuthoritationUrl(redirectUri: string, state?: any): string {
        return this.authentication.authorize(redirectUri, state);
    }

    async getAccessToken(authCode?: string): Promise<object> {
        return this.authentication.accessToken(authCode);
    }

    async refreshAccessToken(refreshToken: string): Promise<object> {
        return this.authentication.refreshToken(refreshToken);
    }

    async getProviders(providerId?: string): Promise<object> {
        return this.resources.providers(providerId);
    }

    async getApplication(): Promise<object> {
        return this.resources.application();
    }

    async getTestAccounts(testAccountId?: string): Promise<object> {
        return this.resources.testAccounts(testAccountId);
    }

    async getProviderAuthUrl(accessToken: string, providerId: string): Promise<object> {
        return this.ais.authenticate(accessToken, providerId);
    }

    async getAccounts(accessToken: string, customerId: string, options: any): Promise<object> {
        return this.ais.getAccounts(accessToken, customerId, options);
    }

    async getTransactions(accessToken: string, customerId: string, accountId, options: any): Promise<object> {
        return this.ais.getTransactions(accessToken, customerId, accountId, options);
    }

    async getAccountHolders(accessToken: string, customerId: string, options: any): Promise<object> {
        return this.ais.getAccountHolders(accessToken, customerId, options);
    }

    async paymentInitiate(accessToken: string, providerId: string, payload: any, redirectUri: string, state?: string): Promise<object> {
        return this.pis.initiate(accessToken, providerId, payload, redirectUri, state);
    }

    async paymentConfirmation(accessToken: string, customerId: string, sessionId: string): Promise<object> {
        return this.pis.confirm(accessToken, customerId, sessionId);
    }

    async getPayment(accessToken: string, customerId: string, sessionId: string): Promise<object> {
        return this.pis.getPayments(accessToken, customerId, sessionId);
    }

    async getPisConnectUrl(accessToken: string, connectConfig: any): Promise<string> {
        return this.connect.getPisConnectUrl(accessToken, connectConfig);
    }

    verifyConnectUrlParameters(queryString): boolean {
        return this.connect.verifyUrlParameters(queryString);
    }

    _validateConfigIntegrity(config) {
        if (!config.app_id) {
            throw Error('app_id is not configured');
        }

        if (!config.app_secret) {
            throw Error('app_secret is not configured');
        }

        if (!config.private_key && config.env == Constants.PRODUCTIONENVIRONMENT) {
            throw Error('private_key must be a string');
        }

        if (config.private_key && typeof config.private_key != 'string') {
            throw Error('private_key must be a string');
        }

        if (config.env && ['sandbox', 'production'].includes(this.config.env)) {
            throw Error('environment is badly configured.');
        }

        if (!config.env) {
            config.env = Constants.DEFAULTENVIRONMENT;
        }

        return <Config>config;
    }

}