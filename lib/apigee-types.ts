// Apigee DTO structures

interface ApigeeApiProducts {
  apiProduct: ApigeeApiProduct[];
}

interface ApigeeApiProduct {
  name: string;
  displayName: string;
  description: string;
  approvalType: string;
  attributes: KeyValue[];
}

interface ApigeeApps {
  app: ApigeeApp[];
  error?: Error;
}

interface ApigeeApp {
  appId: string;
  name: string;
  status?: string;
  callbackUrl?: string;
  createdAt?: string;
  credentials?: ApigeeAppCredential[];
  apiProducts?: string[];
  error?: Error;
}

interface ApigeeAppCredential {
  consumerKey: string;
  consumerSecret: string;
  issuedAt: string;
  expiresAt: string;
  scopes?: string[];
  status?: string;
  apiProducts?: ApigeeApiProductName[];
}

interface ApigeeApiProductName {
  apiproduct: string;
  status: string;
}

interface ApigeeAccessToken {
  access_token: string;
}

interface ApigeeDevelopers {
  developer: ApigeeDeveloper[];
}

interface ApigeeDeveloper {
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

interface ApigeeRatePlanResponse {
  ratePlan: ApigeeRatePlan[];
}

interface ApigeeDevRatePlanResponse {
  developerRatePlan: ApigeeDevRatePlan[];
}

interface ApigeeDevCreditBalanceResponse {
  developerBalance: ApigeeBalance[];
}

interface ApigeeDevRatePlan {
  id: string;
  nextCycleStartDate: string;
  nextRecurringFeeDate: string;
  renewalDate: string;
  startDate: string;
  endDate: string;
  quotaTarget: string;
  ratePlan: ApigeeRatePlan;
}

interface ApigeeRatePlan {
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

interface ApigeeRatePlanDetails {
  meteringType: string;
  durationType: string;
  ratingParameter: string;
  revenueType: string;
  ratePlanRates: ApigeeRatePlanRates[];
}

interface ApigeeRatePlanRates {
  ratingParameter: string;
  revenueType: string;
  type: string;
  startUnit: number;
  endUnit: number;
  rate: number;
}

interface ApigeeBalance {
  id: string;
  isRecurring: boolean;
  supportedCurrency?: ApigeeCurrency;
  chargePerUsage: boolean;
  usage: number;
  amount: number;  
}

interface ApigeeCurrency {
  id: string;
  name: string;
  displayName: string;
}

// Neutral DTO structures

interface ApiProducts {
  apiProducts: ApiProduct[];
}

interface ApiProduct {
  name: string;
  displayName: string;
  description?: string;
  approvalType: string;
  image?: string;
  specUrl?: string;
  status?: string;
}

interface Developers {
  developers: Developer[];
  error?: Error;
}

interface Developer {
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

interface Error {
  code: string;
  message: string;
  status: string;
}

interface KeyValue {
  name: string;
  value: string;
}

interface Apps {
  apps: App[];
  error?: Error;
}

interface App {
  appId: string;
  name: string;
  createdAt: string;
  callbackUrl?: string;
  apiProducts?: string[];
  status?: string;
  credentials?: AppCredential[];
  error?: Error;
}

interface AppCredential {
  consumerKey: string;
  consumerSecret: string;
  issuedAt: string;
  expiresAt: string;
  scopes?: string[];
  apiProducts?: AppCredentialProduct[];
  status?: string;
}

interface AppCredentialProduct {
  apiproduct: string;
  status?: string;
}

interface DevRate {
  id: string;
  nextCycleStartDate: string;
  nextRecurringFeeDate: string;
  renewalDate: string;
  startDate: string;
  endDate: string;
  quotaTarget: string;
  ratePlan: Rate;
}

interface Rate {
  id: string;
  name: string;
  image?: string;
  ratePlanDetails: RateDetail[];
}

interface RateDetail {
  meteringType: string;
  durationType: string;
  ratingParameter: string;
  revenueType: string;
  ratePlanRates: RateDetailRates[];
}

interface RateDetailRates {
  type: string;
  startUnit: number;
  endUnit: number;
  rate: number;  
}

interface DevCreditAccount {
  id: string;
  currency: string;
  isRecurring: boolean;
  chargePerUsage: boolean;
  usage: number;
  amount: number;
}

interface Response {
  status: number;
  data: object;
}

interface error {
  response: Response;
}

export {
  ApigeeApiProducts,
  ApigeeApiProduct,
  ApiProducts,
  ApiProduct,
  ApigeeDevelopers,
  ApigeeDeveloper,
  ApigeeApps,
  ApigeeApp,
  ApigeeAppCredential,
  Developers,
  Developer,
  Apps,
  App,
  AppCredential
}