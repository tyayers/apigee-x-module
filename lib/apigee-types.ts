// Apigee DTO structures

export interface ApigeeApiProducts {
  apiProduct: ApigeeApiProduct[];
}

export interface ApigeeApiProduct {
  name: string;
  displayName: string;
  description: string;
  approvalType: string;
  attributes: KeyValue[];
}

export interface ApigeeApps {
  app: ApigeeApp[];
  error?: Error;
}

export interface ApigeeApp {
  appId: string;
  name: string;
  status?: string;
  callbackUrl?: string;
  createdAt?: string;
  credentials?: ApigeeAppCredential[];
  apiProducts?: string[];
  error?: Error;
}

export interface ApigeeAppCredential {
  consumerKey: string;
  consumerSecret: string;
  issuedAt: string;
  expiresAt: string;
  scopes?: string[];
  status?: string;
  apiProducts?: ApigeeApiProductName[];
}

export interface ApigeeApiProductName {
  apiproduct: string;
  status: string;
}

export interface ApigeeAccessToken {
  access_token: string;
}

export interface ApigeeDevelopers {
  developer: ApigeeDeveloper[];
}

export interface ApigeeDeveloper {
  developerId?: string;
  organizationName: string;
  createdAt: string;
  lastModifiedAt: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  status?: string;
  apps: string[];
  attributes: KeyValue[];
  error?: Error;
}

export interface ApigeeRatePlanResponse {
  ratePlan: ApigeeRatePlan[];
}

export interface ApigeeDevRatePlanResponse {
  developerRatePlan: ApigeeDevRatePlan[];
}

export interface ApigeeDevCreditBalanceResponse {
  developerBalance: ApigeeBalance[];
}

export interface ApigeeDevRatePlan {
  id: string;
  nextCycleStartDate: string;
  nextRecurringFeeDate: string;
  renewalDate: string;
  startDate: string;
  endDate: string;
  quotaTarget: string;
  ratePlan: ApigeeRatePlan;
}

export interface ApigeeRatePlan {
  id: string;
  displayName: string;
  description: string;
  name: string;
  published: boolean;
  setUpFee: number;
  recurringFee: number;
  recurringType: string;
  startDate: string;
  endDate: string;
  currency: ApigeeCurrency;
  ratePlanDetails: ApigeeRatePlanDetails[];
}

export interface ApigeeRatePlanDetails {
  meteringType: string;
  durationType: string;
  ratingParameter: string;
  revenueType: string;
  ratePlanRates: ApigeeRatePlanRates[];
}

export interface ApigeeRatePlanRates {
  ratingParameter: string;
  revenueType: string;
  type: string;
  startUnit: number;
  endUnit: number;
  rate: number;
}

export interface ApigeeBalance {
  id: string;
  isRecurring: boolean;
  supportedCurrency?: ApigeeCurrency;
  chargePerUsage: boolean;
  usage: number;
  amount: number;  
}

export interface ApigeeCurrency {
  id: string;
  name: string;
  displayName: string;
}

// Neutral DTO structures

export interface ApiProducts {
  apiProducts: ApiProduct[];
}

export interface ApiProduct {
  name: string;
  type?: string;
  displayName: string;
  description?: string;
  approvalType: string;
  imageUrl?: string;
  specUrl?: string;
  status?: string;
  access?: string;
}

export interface Developers {
  developers: Developer[];
  error?: Error;
}

export interface Developer {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  developerId?: string;
  organizationName?: string;
  createdAt?: string;
  lastModifiedAt?: string;
  status?: string;
  apps?: string[];
  error?: Error;
}

export interface Error {
  code: string;
  message: string;
  status: string;
}

export interface KeyValue {
  name: string;
  value: string;
}

export interface Apps {
  apps: App[];
  error?: Error;
}

export interface App {
  appId: string;
  name: string;
  createdAt: string;
  callbackUrl?: string;
  apiProducts?: string[];
  status?: string;
  credentials?: AppCredential[];
  error?: Error;
}

export interface AppCredential {
  consumerKey: string;
  consumerSecret: string;
  issuedAt: string;
  expiresAt: string;
  scopes?: string[];
  apiProducts?: AppCredentialProduct[];
  status?: string;
  error?: Error;
}

export interface AppCredentialProduct {
  apiproduct: string;
  status?: string;
}

export interface DevRate {
  id: string;
  nextCycleStartDate: string;
  nextRecurringFeeDate: string;
  renewalDate: string;
  startDate: string;
  endDate: string;
  quotaTarget: string;
  ratePlan: Rate;
}

export interface Rate {
  id: string;
  name: string;
  image?: string;
  ratePlanDetails: RateDetail[];
}

export interface RateDetail {
  meteringType: string;
  durationType: string;
  ratingParameter: string;
  revenueType: string;
  ratePlanRates: RateDetailRates[];
}

export interface RateDetailRates {
  type: string;
  startUnit: number;
  endUnit: number;
  rate: number;  
}

export interface DevCreditAccount {
  id: string;
  currency: string;
  isRecurring: boolean;
  chargePerUsage: boolean;
  usage: number;
  amount: number;
}

export interface ProxyRevision {
  name: string,
  createdAt?: string,
  displayName?: string,
  description?: string,
  lastModifiedAt?: string,
  revision: string
}

export interface ProxyDeployment {
  environment: string,
  apiProxy: string,
  revision: string,
  deployStartTime: string
}

export interface EnvironmentGroup {
  name: string;
  hostnames: string[];
  createdAt: string;
  lastModifiedAt: string;
  state: string;
}

export interface EnvironmentGroupAttachment {
  name: string;
  environment: string;
  createdAt: string;
  state: string;
}

export interface Response {
  status: number;
  data: object;
}

export interface error {
  response: Response;
}

export interface ApiManagementInterface {
  getApiProducts(): Promise<ApiProducts>;
  createApiProduct(apiProduct: ApiProduct): Promise<ApiProduct>;
  deleteApiProduct(apiProductName: string): Promise<ApiProduct>;

  getEnvironments(): Promise<String[]>;
  getEnvironmentGroups(): Promise<EnvironmentGroup[]>;
  getEnvironmentGroupAttachments(): Promise<EnvironmentGroupAttachment[]>;

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

  getAppCredential(email: string, appName: string, keyName: string): Promise<AppCredential>
  updateAppCredential(email: string, appName: string, key: AppCredential): Promise<AppCredential>

  updateAppCredentialAddProducts(email: string, appName: string, keyName: string, apiProducts: string[]): Promise<AppCredential>
  updateAppCredentialRemoveProduct(email: string, appName: string, keyName: string, apiProduct: string): Promise<AppCredential>  

  updateProxy(proxyName: string, bundlePath: string) : Promise<ProxyRevision>
  deployProxyRevision(environmentName: string, proxyName: string, proxyVersion: string): Promise<ProxyDeployment>
}