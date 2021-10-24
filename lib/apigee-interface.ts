import { ApiProduct, ApiProducts, Developers, Developer, Apps, App, AppCredential } from "./apigee-types";

// Class interfaces
export interface ApiManagementInterface {
  getApiProducts(): Promise<ApiProducts>;
  createApiProduct(apiProduct: ApiProduct): Promise<ApiProduct>;
  deleteApiProduct(apiProductName: string): Promise<ApiProduct>;

  getDevelopers(): Promise<Developers>
  getDeveloper(email: string): Promise<Developer>
  createDeveloper(developerData: Developer): Promise<Developer>
  updateDeveloper(developerData: Developer): Promise<Developer>
  deleteDeveloper(email: string): Promise<Developer>
  getApps(email: string) : Promise<Apps>
  getApp(email: string, appName: string) : Promise<App>
  createApp(email: string, appName: string, apiProducts: string[]): Promise<App>
  updateApp(email: string, appName: string, app: App): Promise<App>
  
  getAppCredential(email: string, appName: string, keyName: string): Promise<AppCredential>
  updateAppCredential(email: string, appName: string, key: AppCredential): Promise<AppCredential>

  updateAppCredentialAddProducts(email: string, appName: string, keyName: string, apiProducts: string[]): Promise<AppCredential>
  updateAppCredentialRemoveProduct(email: string, appName: string, keyName: string, apiProduct: string): Promise<AppCredential>  
  
  deleteApp(email: string, appName: string): Promise<App>
}