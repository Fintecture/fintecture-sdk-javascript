# Fintecture

Fintecture is a licensed and one-stop shop gateway to Open Banking.

Our APIs allow easy and secure access to bank account data and payment initiation. The account data accessible are account holder's personal information, account balances, transaction history and much more. The available payment methods depend on the banks implementation but typically are domestic transfers, SEPA credit transfer, instant SEPA credit transfer, fast payment scheme, and SWIFT international payments.

Fintecture APIs enable to connect to both Production and Sandbox environments of banks. Our Sandbox has the particularity of being connected to other banks' Sandbox. This will give you a flavour of what you can expect in production in terms of user experience and data sets.

## Installation

```javascript
npm install 'fintecture-client'
```

## Usage

The SDK enables multiple use cases. Essentially, it runs down to whether you want / need to go through our bank selection module "Fintecture Connect" ( which is mandatory if you're not an Agent or a licensed TPP. )

This section is divided based on the following use cases:

- First Steps
- Use Cases
  - AIS without Connect
  - AIS with Connect
  - PIS without Connect
  - PIS with Connect

### Get Started

Independantly of the use case, the first step is to create a developer account on the [Fintecture Console](https://console.fintecture.com/auth/register) and create an application to get your **app_id**, **app_secret** and **private_key**.

You are now ready to start coding. Next step is
import the Fintecture Client library and instantiate the client object:

```javascript
const { FintectureClient } = require('fintecture-client');

let client = new FintectureClient({ 
        app_id: process.env.APP_ID
        ,app_secret: process.env.APP_SECRET
        ,private_key: process.env.APP_PRIV_KEY
        ,env: process.env.FINTECTURE_ENV 
        });

```

### Use Cases

#### AIS without Connect

To access the PSU's account information, you have to go through the following steps:

##### Scenario 1: Redirect Model

1. Select a Bank

```javascript
let options = {'filter[ais]': 'accounts', 'filter[country]': 'FR', 'filter[psu_type]': 'retail', 'filter[auth_model]': 'redirect', 'sort[full_name]': 'asc'}
let providers = await client.getProviders(options);
```

2. Get the bank's authentication URL and redirect your PSU to his bank

```javascript
let providerAuth = await client.getRedirectAuthUrl(null, providerId, redirectUri, state);
windows.href.location = providerAuth.url;
```

3. Authenticate your app to Fintecture and get your **access_token** and **refresh_token**

```javascript
let tokens = await client.getAccessToken(code);
```

4. Request any AIS API

```javascript
let accounts = await client.getAccounts(accessToken, customerId);

let account = accounts.data[0].id
let transactions = await client.getTransactions(accessToken, customerId, account);
```

> Note that the **code** and **customer_id** are returned as query parameters when the PSU is redirected back to your environment.

##### Scenario 2: Decoupled Model


1. Select a Bank

```javascript
let options = {'filter[ais]': 'accounts', 'filter[country]': 'FR', 'filter[psu_type]': 'retail', 'filter[auth_model]': 'decoupled', 'sort[full_name]': 'asc'}
let providers = await client.getProviders(options);
```

2. Get the provider's decoupled auth polling URL

```javascript
let providerAuth = await client.getDecoupledAuthUrl(null, providerId, psuId, psuIpAddress);
let pollingId = providerAuth.polling_id;
```

3. Keep polling the provider's decoupled auth polling URL until authentication either COMPLETED or FAILED

```javascript
let customerId = null;
let code = null;
var loop = setInterval(function(){
    let auth = await client.getDecoupledAuthStatus(null, providerId, pollingId);
    if (auth.status != 'PENDING') {
        customerId = auth.customer_id;
        code = auth.code;
        clearInterval(loop);
    }
}, 2000);
```

4. Authenticate your app to Fintecture and get your **access_token** and **refresh_token**

```javascript
let tokens = await client.getAccessToken(code);
```

5. Request any AIS API

```javascript
let accounts = await client.getAccounts(accessToken, customerId);

let account = accounts.data[0].id
let transactions = await client.getTransactions(accessToken, customerId, account);
```

> Note that the **code** and **customer_id** are returned as query parameters when the PSU is redirected back to your environment.

#### AIS with Connect

To enable AIS using connect, simply redirect the PSU to the generated URL:

```javascript
let config = {
   redirect_uri: 'https://mysite.com/callback',
   state: "thisisastate",
   psu_type: 'retail',
   country: 'fr'
}

let connect = client.getAisConnect(null, config)
window.href.location = connect.url;
```

On callback, exchange the code for an accesstoken, and use the accesstoken coupled with the customer_id to get your PSU AIS resources:

```javascript
// save querystring parameters
const code = req.query.code;
const customerId = req.query.customer_id;

// get the Fintecture access token to request the AIS APIs
const tokens = await client.getAccessToken(code);
const accounts = await client.getAccounts(tokens.access_token, customerId);
```

#### PIS without Connect

The initiate a payment on behalf of a PSU, you have to go through the following steps:

1. Select a Bank

```javascript
let options = {'filter[pis]': 'SEPA', 'filter[country]': 'FR', 'filter[psu_type]': 'retail', 'sort[full_name]': 'asc'}
let providers = await client.getProviders(options);
```

2. Authenticate your app to Fintecture and get your **access_token**

```javascript
let token = await client.getAccessToken();
```

3. Initiate a payment

```javascript
let payment = {
            data: {
                type: "PIS",
                attributes: {
                    amount: 1,
                    currency: "EUR",
                    communication: "Thanks Mom!",
                    beneficiary : {
                        name : "Bob Smith",
                        address : "8 road of somewhere, 80330 Lisboa",
                        country : "ES",
                        iban : "PT07BARC20325388680799",
                        swift_bic: "DEUTPTFF"
                    }
                }
            }
        }

let response = await client.paymentInitiate(accessToken, providerId, payment, redirectUri, state);
```


#### PIS with Connect

The initiate a payment on behalf of a PSU using Fintecture Connect, just do:

```javascript
let connectConfig = {
    amount: 125,
    currency: 'EUR',
    communication: 'Thanks mom!',
    customer_full_name: 'Bob Smith',
    customer_email: 'bob.smith@gmail.com',
    customer_ip: '127.0.0.1',
    state: 'somestate'
};

let tokens = await client.getAccessToken();
let connect = await client.getPisConnect(tokens.access_token, connectConfig);
window.href.location = connect.url;

// and at any time (ex: to validate a payment on callback)
let payment = await client.getPayments(tokens.access_token, connect.session_id);
console.log("PAYMENT STATUS:", payment.meta.status);

```

Description of Connect fields:
* amount: [mandatory] The amount of the payment initiation request. Min 1.00 and Max is variable based on bank's policy.
* currency: [mandatory] The currency of the payment initiation request. Currently, only EUR and GBP is supported.
* communication: [optional] A message sent to the beneficiary of the payment and visible on his bank statement. In the context of ecommerce payment collection, the order reference is inputted here.
* customer_full_name: [mandatory] the full name of the payer
* customer_email: [mandatory] the email of the payer
* customer_ip: [mandatory] the ip address of the payer
* redirect_uri: [optional] the callback URL to which the customer is redirected after authentication with his bank
* origin_uri: [optional] a URL to which the customer will be redirected if he wants to exit Fintecture Connect
* state: [mandatory] A state parameter which is sent back on callback. In the context of ecommerce, input the order ID here.

## Pagination

Pagination can occur on the transaction endpoint. When requesting the getTransaction() function, you will receive a $.links.next URL. In order to iterate on the pages, supply that URL in the paginationURL field within the getTransactions function:

```javascript

let transactionsPages = [];

let transactions = await client.getTransactions(accessToken, customerId, accountId, headers);
transactionsPages.push(transactions)

if (transactions.links.next) {
    while (transactions.links.next) {
        transactions = await client.getTransactions(accessToken, customerId, accountId, headers,transactions.links.next) ;
        transactionsPages.push(transactions);
    }
}


```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/Fintecture/fintecture-sdk-javascript. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The library is available as open source under the terms of the [GPL-3.0 License](http://www.gnu.org/licenses/gpl-3.0.txt).

## Code of Conduct

Everyone interacting in the Fintecture project’s codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/Fintecture/fintecture-sdk-javascript/CODE_OF_CONDUCT.md).
