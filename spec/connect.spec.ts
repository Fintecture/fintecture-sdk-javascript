import { FintectureClient } from '../fintecture-client';
import { IPisSetup, IAisSetup } from './../src/interfaces/connect/ConnectInterface';
import { Connect } from './../src/Connect';
import { IFintectureConfig } from './../src/interfaces/ConfigInterface';
import { TestConfig } from './constants/config';

const connectPisConfigMin: IPisSetup = {
    amount: 125,
    currency: 'EUR',
    communication: 'Thanks mom!',
    redirect_uri: 'https://www.google.com/callback',
    origin_uri: 'https://www.google.com/shop',
};

const connectPisConfigFull: IPisSetup = {
    amount: 125,
    currency: 'EUR',
    communication: 'Thanks mom!',
    customer_full_name: 'Bob Smith',
    customer_email: 'bob.smith@gmail.com',
    customer_ip: '123.456.789.123',
    redirect_uri: 'https://www.google.com/callback',
    origin_uri: 'https://www.google.com/shop',
    state: 'somestate'
};

const connectAisMin: IAisSetup = {
    redirect_uri: 'https://www.google.com/callback',
    origin_uri: 'https://www.google.com/shop',
    state: 'somestate'
};


const client = new FintectureClient({ app_id: TestConfig.appIdMerchant, app_secret: TestConfig.appSecretMerchant, private_key: TestConfig.appPrivKeyMerchant });

describe('Connect', () => {
    it('#PIS getPisConnect', async (done) => {
        const tokens: any = await client.getAccessToken();
        const connectMin = await client.getPisConnect(tokens.access_token, connectPisConfigMin);
        expect(!!connectMin.session_id).toBe(true);
        const connectFull = await client.getPisConnect(tokens.access_token, connectPisConfigFull);
        expect(!!connectFull.session_id).toBe(true);
        expect(connectFull.url.length).toBeGreaterThan(connectMin.url.length)
        done();
    });

    it('#AIS getAisConnectUrl', async (done) => {
        const connect = await client.getAisConnect(null, connectAisMin);
        expect(!!connect.url).toBe(true);
        done();
    });


    it('#PIS getConnectUrl Error no amount', async (done) => {
        let errorMessage = 'No error thrown.';

        const ConnectUrlFulltemp = Object.assign({}, connectPisConfigFull);
        delete ConnectUrlFulltemp['amount'];

        try {
            const tokens: any = await client.getAccessToken();
            await client.getPisConnect(tokens.access_token, ConnectUrlFulltemp);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('amount not set');
        done();
    });

    it('#PIS getConnectUrl Error no currency', async (done) => {
        let errorMessage = 'No error thrown.';

        const ConnectUrlFulltemp = Object.assign({}, connectPisConfigFull);
        delete ConnectUrlFulltemp['currency'];

        try {
            const tokens: any = await client.getAccessToken();
            await client.getPisConnect(tokens.access_token, ConnectUrlFulltemp);
        } catch (error) {
            errorMessage = error.message;
        }

        expect(errorMessage).toBe('currency not set');
        done();
    });

});

describe('Connect._buildPaymentPayload (unit, offline)', () => {
    const buildConnect = () => new Connect({ env: 'sandbox' } as unknown as IFintectureConfig);
    const build = (payment: any) => (buildConnect() as any)._buildPaymentPayload(payment);

    const basePayment = {
        amount: 125,
        currency: 'EUR',
        communication: 'Thanks mom!',
        customer_full_name: 'Bob Smith',
        customer_email: 'bob.smith@gmail.com',
        customer_ip: '127.0.0.1',
    };

    it('builds attributes + meta from minimal payment', () => {
        const payload = build(basePayment);
        expect(payload.data.type).toBe('SEPA');
        expect(payload.data.attributes.amount).toBe(125);
        expect(payload.data.attributes.currency).toBe('EUR');
        expect(payload.data.attributes.communication).toBe('Thanks mom!');
        expect(payload.meta.psu_name).toBe('Bob Smith');
        expect(payload.meta.psu_email).toBe('bob.smith@gmail.com');
        expect(payload.meta.psu_ip).toBe('127.0.0.1');
    });

    it('forwards external_reference to attributes when set', () => {
        const payload = build({ ...basePayment, external_reference: 'invoice-42' });
        expect(payload.data.attributes.external_reference).toBe('invoice-42');
    });

    it('omits external_reference from attributes when not set', () => {
        const payload = build(basePayment);
        expect(payload.data.attributes.external_reference).toBeUndefined();
    });

    it('forwards debited_account_id and type to attributes when set', () => {
        const payload = build({
            ...basePayment,
            debited_account_id: 'FR7612345',
            debited_account_type: 'IBAN',
        });
        expect(payload.data.attributes.debited_account_id).toBe('FR7612345');
        expect(payload.data.attributes.debited_account_type).toBe('IBAN');
    });

    it('maps payment_methods string array to meta {id, order} objects', () => {
        const payload = build({
            ...basePayment,
            payment_methods: ['immediate_transfer', 'smart_transfer'],
        });
        expect(payload.meta.payment_methods).toEqual([
            { id: 'immediate_transfer', order: 0 },
            { id: 'smart_transfer', order: 1 },
        ]);
    });

    it('omits payment_methods from meta when empty array', () => {
        const payload = build({ ...basePayment, payment_methods: [] });
        expect(payload.meta.payment_methods).toBeUndefined();
    });

    it('uses nested psu_address as meta.psu_address when provided', () => {
        const address = { name: 'Bob', street: 'Main', number: '1', city: 'Paris', zip: '75001', country: 'FR' };
        const payload = build({ ...basePayment, psu_address: address });
        expect(payload.meta.psu_address).toEqual(address);
    });

    it('assembles meta.psu_address from flat psu_address_* fields when nested not provided', () => {
        const payload = build({
            ...basePayment,
            psu_address_street: 'Main',
            psu_address_zip: '75001',
            psu_address_city: 'Paris',
            psu_address_country: 'FR',
        });
        expect(payload.meta.psu_address).toEqual(jasmine.objectContaining({
            street: 'Main',
            zip: '75001',
            city: 'Paris',
            country: 'FR',
        }) as any);
    });

    it('prefers nested psu_address over flat fields when both present', () => {
        const nested = { name: 'X', street: 'Nested', number: '9', city: 'Nice', zip: '06000', country: 'FR' };
        const payload = build({
            ...basePayment,
            psu_address: nested,
            psu_address_street: 'Flat',
        });
        expect(payload.meta.psu_address).toEqual(nested);
    });

    it('leaves meta.psu_address undefined when neither nested nor flat are set', () => {
        const payload = build(basePayment);
        expect(payload.meta.psu_address).toBeUndefined();
    });

    it('forwards psu_phone_prefix to meta when set', () => {
        const payload = build({ ...basePayment, psu_phone_prefix: '+33' });
        expect(payload.meta.psu_phone_prefix).toBe('+33');
    });

    it('omits psu_phone_prefix from meta when not set', () => {
        const payload = build(basePayment);
        expect(payload.meta.psu_phone_prefix).toBeUndefined();
    });

    it('forwards expiry (seconds) to meta when set', () => {
        const payload = build({ ...basePayment, expiry: 3600 });
        expect(payload.meta.expiry).toBe(3600);
    });

    it('forwards custom (string) to meta when set', () => {
        const payload = build({ ...basePayment, custom: 'order-ref-42' });
        expect(payload.meta.custom).toBe('order-ref-42');
    });

    it('forwards custom (object) to meta when set', () => {
        const reconciliation = { order_id: 42, source: 'pos' };
        const payload = build({ ...basePayment, custom: reconciliation });
        expect(payload.meta.custom).toEqual(reconciliation);
    });

    it('omits custom from meta when not set, null, or empty string', () => {
        expect(build(basePayment).meta.custom).toBeUndefined();
        expect(build({ ...basePayment, custom: null }).meta.custom).toBeUndefined();
        expect(build({ ...basePayment, custom: '' }).meta.custom).toBeUndefined();
    });

    it('forwards target_env to meta when set', () => {
        const payload = build({ ...basePayment, target_env: 'production' });
        expect(payload.meta.target_env).toBe('production');
    });

    it('omits target_env from meta when not set', () => {
        const payload = build(basePayment);
        expect(payload.meta.target_env).toBeUndefined();
    });
});