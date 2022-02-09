import { ApiManagementInterface } from "../lib/apigee.types";
import { ApigeeService } from "../lib/apigee.service";
import { expect } from "chai";
import { doesNotMatch } from "assert";

require('mocha');
require('dotenv').config()

let apigeeService: ApiManagementInterface = new ApigeeService(undefined, undefined);

describe('Get environments', () => {
  return it('should return the environments', () => {
    return apigeeService.getEnvironments().then((response: String[]) => {
      // console.log(response);
      expect(response.length).to.greaterThan(0);
    });
  });
});
