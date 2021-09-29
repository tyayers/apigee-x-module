# apigee-x-module

This is a nodejs module to interact with the Apigee X APIs for SaaS and hybrid
orgs.  This is especially useful when creating a DIY developer portal.

## Getting Started

To get started, simply import the module into your TS/JS project.

```sh
npm i apige-x-module
```

Then after importing the module, you can instantiate the Apigee service
with a **GCP service account email**, **GCP service account private key**, and
**Apigee org name** (which are typically
stored as environment variables using [dotenv](https://www.npmjs.com/package/dotenv)).  

```js
import { ApigeeService, ApiManagementInterface, ApiProducts } from "apigee-x-module";

const apigeeService: ApiManagementInterface = new ApigeeService(process.env.SERVICE_ACCOUNT_EMAIL, process.env.SERVICE_ACCOUNT_KEY, process.env.APIGEE_ORG);
```

And finally you can call the API to retrieve API products, create or edit
developers, or create apps and credentials to access APIs.

Here we are serving API Products in an express app to a web client developer portal.

```js
const app = express();

app.get('/apiproducts', (req, res) => {
  apigeeService.getApiProducts().then((response) => {
    res.send({
      apiproducts: response.apiProducts
    });
  }).catch((error) => {
    console.error(error);
    res.status(500).send(error);
  })
});
```

## Build

To build, just run:

```sh
npm run build
```

## Test

To test, first add your GCP service account details and Apigee org name to local
environment variables, and then run:

```sh
npm run test
```

If your Apigee org has at least one API product, then all tests should pass.

## Open Issues

Not all Apigee X APIs are supported yet (see lib/apigee-interface.ts for which
operations are currently supported).  If you need particular APIs to be added
simply add here as Github issues, or submit a PR with the changes.
