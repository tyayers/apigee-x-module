import { ApiProduct, Developers, Developer, Apps, App, AppCredential, ApiManagementInterface } from "../lib/interfaces";
import { ApigeeService } from "../lib/service";
import { expect } from "chai";
import { doesNotMatch } from "assert";

import { } from 'mocha';

import dotenv from 'dotenv';
dotenv.config();

let apigeeService: ApiManagementInterface = new ApigeeService();

let testDeveloper: Developer = {
  email: "test.developer@example.com",
  userName: "test.developer@example.com",
  firstName: "Test",
  lastName: "Developer"
};

let testApiProduct1: ApiProduct = {
  "name": "Test Product 1",
  "displayName": "Test Product 1",
  "approvalType": "auto",
  "description": "Test Product 1"
};

let testApiProduct2: ApiProduct = {
  "name": "Test Product 2",
  "displayName": "Test Product 2",
  "approvalType": "auto",
  "description": "Test Product 2"
};

let testAppName: string = "Test App";
let testApp: App;

describe('Create API Product 1', () => {
  return it('should create a new API product', () => {
    return apigeeService.createApiProduct(testApiProduct1).then((response: ApiProduct) => {
      // console.log(response);
      expect(response.name).to.equal(testApiProduct1.name);
    });
  });
});

describe('Create API Product 2', () => {
  return it('should create a new API product', () => {
    return apigeeService.createApiProduct(testApiProduct2).then((response: ApiProduct) => {
      // console.log(response);
      expect(response.name).to.equal(testApiProduct2.name);
    });
  });
});

describe('Create Developer', () => {
  return it('should create a new developer', () => {
    return apigeeService.createDeveloper(testDeveloper).then((response: Developer) => {
      //console.log(response);
      expect(response.email).to.equal(testDeveloper.email);
    });
  });
});

describe('Get developers', () => {
  return it('should return list of developers with length > 0', () => {
    return apigeeService.getDevelopers().then((response: Developers) => {
      //console.log(response.developers);
      expect(response.developers.length).to.above(0);
    });
  });
});

describe('Get test developer', () => {
  return it('should return the test developer', () => {
    return apigeeService.getDeveloper(testDeveloper.email).then((response: Developer) => {
      //console.log(response.developers);
      expect(response.email).to.equal(testDeveloper.email);
    });
  });
});

describe('Get non-existent developer', () => {
  return it('should return 404 developer not found', () => {
    return apigeeService.getDeveloper("testDeveloper@example.com").then((response: Developer) => {
      //console.log(response);
      expect(response?.error?.code).to.equal(404);
    });
  });
});

describe('Create App for non-existent product', () => {
  return it('should return 400 api product does not exist', () => {
    return apigeeService.createApp(testDeveloper.email, testAppName, ["Test Product"]).then((response: App) => {
      //console.log(response);
      expect(response?.error?.code).to.equal(400);
    });
  });
});

describe('Get apps', () => {
  return it('should return list of apps with length == 0', () => {
    return apigeeService.getApps(testDeveloper.email).then((response: Apps) => {
      //console.log(response);
      expect(response.apps.length).to.equal(0);
    });
  });
});

describe('Create App for product', () => {
  return it('should return an app to access product 1', () => {
    return apigeeService.createApp(testDeveloper.email, testAppName, [testApiProduct1.name]).then((response: App) => {
      // console.log(response);
      expect(response.name).to.equal(testAppName);
      if (response.credentials) {
        expect(response?.credentials[0].apiProducts?.length).to.equal(1);

        if (response?.credentials[0].apiProducts)
          expect(response?.credentials[0].apiProducts[0].apiproduct).to.equal(testApiProduct1.name);
      }

      testApp = response;
    });
  });
});

describe('Add a product to an existing key', () => {
  return it('should return an updated credential object with new product added', () => {

    if (testApp.credentials) {
      testApp.credentials[0].apiProducts?.push({
        apiproduct: testApiProduct2.name
      });

      return apigeeService.updateAppCredential(testDeveloper.email, testAppName, testApp.credentials[0]).then((response: AppCredential) => {
        // console.log(response);

        if (response.apiProducts) {
          expect(response.apiProducts[0].apiproduct === testApiProduct1.name);
          expect(response.apiProducts[1].apiproduct === testApiProduct2.name);
          expect(response?.apiProducts?.length).to.equal(2);
        }

        if (testApp.credentials)
          testApp.credentials[0] = response;
      });
    }
  });
});

describe('Remove a product from an existing key', () => {
  return it('should return an updated credential object without removed product', () => {

    // Remove product that was added
    if (testApp.credentials && testApp.credentials.length > 0) {
      testApp.credentials[0].apiProducts?.splice(1, 1);

      return apigeeService.updateAppCredential(testDeveloper.email, testAppName, testApp.credentials[0]).then((response: AppCredential) => {
        //console.log(response);

        if (response.apiProducts) {
          expect(response?.apiProducts?.length).to.equal(1);
          expect(response?.apiProducts[0].apiproduct === testApiProduct1.name);
        }
      });
    }
  });
});

describe('Delete Developer', () => {
  return it('should delete the test developer', () => {
    return apigeeService.deleteDeveloper(testDeveloper.email).then((response: Developer) => {
      //console.log(response);
      expect(response.email).to.equal(testDeveloper.email);
    });
  });
});

describe('Delete API Product 1', () => {
  return it('should delete the api product', () => {
    return apigeeService.deleteApiProduct(testApiProduct1.name).then((response: ApiProduct) => {
      // console.log(response);
      expect(response.name).to.equal(testApiProduct1.name);
    });
  });
});

describe('Delete API Product 2', () => {
  return it('should delete the api product', () => {
    return apigeeService.deleteApiProduct(testApiProduct2.name).then((response: ApiProduct) => {
      //console.log(response);
      expect(response.name).to.equal(testApiProduct2.name);
    });
  });
});


