import { ApiManagementInterface } from "../lib/apigee-interface";
import { ApigeeApiProducts, ApiProducts } from "../lib/apigee-types";
import { ApigeeService } from "../lib/apigee-service";
import { expect } from "chai";
import { doesNotMatch } from "assert";

require('mocha');

require('dotenv').config()

let apigeeService: ApiManagementInterface = new ApigeeService();

describe('Get API products', () => {
  return it('should return list of API products with length > 0', () => {
    return apigeeService.getApiProducts().then((response: ApiProducts) => {
      //console.log(response.apiProducts);
      expect(response.apiProducts.length).to.above(0);
    });
  });
});