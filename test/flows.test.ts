import { ApiManagementInterface, ApigeeApiProducts, ApiProducts, ProxyDeployment, ProxyRevision } from "../lib/interfaces";
import { ApigeeService } from "../lib/service";
import { expect } from "chai";
import { doesNotMatch } from "assert";

import mocha from 'mocha';

import dotenv from 'dotenv';
dotenv.config();

let apigeeService: ApiManagementInterface = new ApigeeService();
let revisionNumber: string = "0";
let environment = "eval"

describe('Update proxy', () => {
  return it('should deploy a new flow revision and return the new revision number', () => {
    return apigeeService.updateFlow("testflow", "test/testdata/testflow.zip").then((response: ProxyRevision) => {
      revisionNumber = response.revision;
      expect(parseInt(response.revision)).to.above(0);

      var newRevision = response.revision;
      describe('Deploy flow', () => {
        return it('should deploy the newly created revision', () => {
          return apigeeService.deployFlowRevision(environment, "testflow", newRevision).then((response: ProxyDeployment) => {

            expect(response.revision).to.equal(newRevision);
          })
        })
      });
    });
  });
});
