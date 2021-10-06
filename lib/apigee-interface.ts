import { ApiProducts, Developers, Developer, Apps, App } from "./apigee-types";

// Class interfaces
export interface ApiManagementInterface {
  getApiProducts(): Promise<ApiProducts>;
  getDevelopers(): Promise<Developers>
  getDeveloper(email: string): Promise<Developer>
  createDeveloper(developerData: Developer): Promise<Developer>
  updateDeveloper(developerData: Developer): Promise<Developer>
  deleteDeveloper(email: string): Promise<Developer>
  getApps(email: string) : Promise<Apps>
  getApp(email: string, appName: string) : Promise<App>
  createApp(email: string, appName: string, apiProducts: string[]): Promise<App>
  updateApp(email: string, appName: string, app: App): Promise<App>
  deleteApp(email: string, appName: string): Promise<App>
}