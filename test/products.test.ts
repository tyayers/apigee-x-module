import { ApiManagementInterface, ApigeeApiProducts, ApiProducts } from "../lib/interfaces";
import { ApigeeService } from "../lib/service";
import { expect } from "chai";
import { doesNotMatch } from "assert";

import mocha from 'mocha';

import dotenv from 'dotenv';
dotenv.config();

let apigeeService: ApiManagementInterface = new ApigeeService();

describe('Get API products', () => {
  return it('should return list of API products with length > 0', () => {
    return apigeeService.getApiProducts().then((response: ApiProducts) => {
      //console.log(response.apiProducts);
      expect(response.apiProducts.length).to.above(0);
    });
  });
});