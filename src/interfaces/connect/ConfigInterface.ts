/**
 * Connect configuration
 * 
 * @interface ConnectConfig
 */

export interface ConnectConfig {
    appId: string,
    appSecret: string,
    privateKey: string,
    redirectUri: string,
    originUri: string,
    state?: string,
    version?: string
}