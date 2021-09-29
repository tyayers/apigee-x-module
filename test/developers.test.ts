import { ApiManagementInterface } from "../lib/apigee-interface";
import { Developers, Developer, Apps, App } from "../lib/apigee-types";
import { ApigeeService } from "../lib/apigee-service";
import { expect } from "chai";
import { doesNotMatch } from "assert";

require('mocha');

require('dotenv').config()

let apigeeService: ApiManagementInterface = new ApigeeService(process.env.SERVICE_ACCOUNT_EMAIL, process.env.SERVICE_ACCOUNT_KEY, process.env.APIGEE_ORG);

let testDeveloper: Developer = {
  email: "test.developer@example.com",
  userName: "test.developer@example.com",
  firstName: "Test",
  lastName: "Developer"
};

let testAppName: string = "Test App";

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
      expect(response.error.code).to.equal(404);
    });
  });
});

describe('Create App for non-existent product', () => {
  return it('should return 400 api product does not exist', () => {
    return apigeeService.createApp(testDeveloper.email, testAppName, ["Test Product"]).then((response: App) => {
      //console.log(response);
      expect(response.error.code).to.equal(400);
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

describe('Delete Developer', () => {
  return it('should delete the test developer', () => {
    return apigeeService.deleteDeveloper(testDeveloper.email).then((response: Developer) => {
      //console.log(response);
      expect(response.email).to.equal(testDeveloper.email);
    });
  });
});