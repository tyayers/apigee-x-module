import { ApiManagementInterface, EnvironmentGroup, EnvironmentGroupAttachment } from "../lib/interfaces";
import { ApigeeService } from "../lib/service";
import { expect } from "chai";
import { doesNotMatch } from "assert";

require('mocha');
require('dotenv').config()

let apigeeService: ApiManagementInterface = new ApigeeService();

describe('Get environments', () => {
  return it('should return the environments', () => {
    return apigeeService.getEnvironments().then((response: String[]) => {
      // console.log(response);
      expect(response.length).to.greaterThan(0);
    });
  });
});

describe('Get environment groups', () => {
  return it('should return all environment groups', () => {
    return apigeeService.getEnvironmentGroups().then((response: EnvironmentGroup[]) => {
      expect(response.length).to.greaterThan(0);

      describe('Get environment group attachments', () => {
        return it('should return all environment group attachments', () => {
          return apigeeService.getEnvironmentGroupAttachments(response[0].name).then((response: EnvironmentGroupAttachment[]) => {
            expect(response.length).to.greaterThan(0);
          });
        });
      });
    });
  });
});
