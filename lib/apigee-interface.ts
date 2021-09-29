import { ApiProducts, Developers, Developer, Apps, App } from "./apigee-types";

// Class interfaces
export interface ApiManagementInterface {
  // createDevApp(token: string, devEmail: string, apiProduct: string, org: string): Promise<app>;
  // createDevRateSub(token: string, devEmail: string, ratePlanId: string, org: string): Promise<devRate>;
  // deleteDevRateSub(token: string, devEmail: string, ratePlanId: string, rateSubId: string, org: string): Promise<devRate>;
  // getRatePlans(token: string, org: string): Promise<rate[]>;
  // addDevCredits(token: string, devEmail: string, currency: string, amount: number, org: string): Promise<devCreditAccount>;
  
  // createOrUpdateApigeeDev(token: string, devData: apigeeDeveloper, org: string): Promise<developer>;

  // getDevApps(token: string, devEmail: string, org: string): Promise<app[]>;
  // getDevRatePlans(token: string, devEmail: string, org: string): Promise<devRate[]>;
  // getDevCreditAccounts(token: string, devEmail: string, org: string): Promise<devCreditAccount[]>;

  getApiProducts(): Promise<ApiProducts>;
  
  getDevelopers(): Promise<Developers>
  getDeveloper(email: string): Promise<Developer>
  createDeveloper(developerData: Developer): Promise<Developer>
  updateDeveloper(developerData: Developer): Promise<Developer>
  deleteDeveloper(email: string): Promise<Developer>
  
  getApps(email: string) : Promise<Apps>
  createApp(email: string, appName: string, apiProducts: string[]): Promise<App>
  // updateApp(email: string, apiProducts: string[]): Promise<App>
  // deleteApp(email: string, apiProducts: string[]): Promise<App>
}

// Function interfaces
// interface GetRatePlansFunc {
//   (token: string, org: string): Promise<Rate[]>;
// }