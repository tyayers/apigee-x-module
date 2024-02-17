import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';
import { GoogleAuth } from 'google-auth-library';
const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

//import { resolve } from "path/posix";
import { ApiManagementInterface, ApigeeApiProducts, ApigeeApiProduct, ApiProducts, ApiProduct, App, ApigeeDevelopers, ApigeeDeveloper, Developers, Developer, ApigeeApps, ApigeeApp, ApigeeAppCredential, Apps, AppCredential, ProxyRevision, ProxyDeployment, EnvironmentGroup, EnvironmentGroupAttachment, ApigeeEnvGroupsReponse, ApigeeEnvGroupAttachmentResponse } from "./interfaces"

/**
 * Apigee Service for using the Apigee X API from TS/JS clients
 * @date 2/9/2022 - 8:17:51 AM
 *
 * @export
 * @class ApigeeService
 * @typedef {ApigeeService}
 * @implements {ApiManagementInterface}
 */
export class ApigeeService implements ApiManagementInterface {

  /**
   * Optional org string (if not set then default GCP project is used)
   * @date 2/9/2022 - 8:18:24 AM
   *
   * @type {string}
   */
  _org: string;

  /**
   * Optional OAuth token to be used for API calls (if not set then token is fetched using GOOGLE_APPLICATION_CREDENTIALS)
   * @date 2/9/2022 - 8:19:34 AM
   *
   * @private
   * @type {string}
   */
  private _token: string;


  /**
   * Setter for the org
   * @date 2/11/2022 - 10:26:01 AM
   *
   * @public
   * @type {string} The new org to set
   */
  public set org(newOrg: string) {
    this._org = newOrg;
  }


  /**
   * Setter for the GCP access token for Apigee API calls
   * @date 2/11/2022 - 10:26:24 AM
   *
   * @public
   * @type {string} The new token to use
   */
  public set token(newToken: string) {
    this._token = newToken;
  }

  /**
   * Gets the org that is available to be used (either set or from Google Auth project)
   * @date 2/9/2022 - 8:25:42 AM
   *
   * @returns {Promise<string>} The org string
   */
  getOrg(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this._org)
        resolve(this._org);
      else
        auth.getProjectId().then((projectId) => {
          resolve(projectId);
        }).catch((error) => {
          reject("No project found.")
        });
    });
  }


  /**
   * Gets the current token (either set or from Google Auth)
   * @date 2/9/2022 - 8:27:04 AM
   *
   * @returns {Promise<string>} The OAuth bearer token to use for the Apigee API call
   */
  getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this._token)
        resolve(this._token);
      else
        auth.getAccessToken().then((token) => {
          resolve(token);
        });
    });
  }

  /**
   * Gets the environments for an org
   * @date 2/9/2022 - 8:27:44 AM
   *
   * @returns {Promise<String[]>} The list of environments from the org
   */
  getEnvironments(): Promise<String[]> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((org) => {
        this.getToken().then((token) => {
          axios.request({
            url: `https://apigee.googleapis.com/v1/organizations/${org}/environments`,
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }).then((response) => {
            let environments: String[] = response.data as String[];
            resolve(environments);
          }).catch((error) => {
            console.error(error);
            reject(error);
          });
        });
      })
    });
  }

  /**
   * Retrieves all environment groups for an org
   * @date 2/9/2022 - 8:29:12 AM
   *
   * @returns {Promise<EnvironmentGroup[]>} List of environment groups
   */
  getEnvironmentGroups(): Promise<EnvironmentGroup[]> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            url: `https://apigee.googleapis.com/v1/organizations/${projectId}/envgroups`,
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }).then((response) => {
            let apigeeEnvGroups = response.data as ApigeeEnvGroupsReponse;
            let envGroups: EnvironmentGroup[] = apigeeEnvGroups.environmentGroups;

            resolve(envGroups);
          }).catch((error) => {
            reject(error);
          });
        });
      });
    });
  }

  /**
   * Retrieves all environment attachments for an environment group
   * @date 5/2/2022 - 12:28:23 PM
   *
   * @param {String} environmentGroup The environment group to get the attachments for
   * @returns {Promise<EnvironmentGroupAttachment[]>} The array of attachments
   */
  getEnvironmentGroupAttachments(environmentGroup: String): Promise<EnvironmentGroupAttachment[]> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            url: `https://apigee.googleapis.com/v1/organizations/${projectId}/envgroups/${environmentGroup}/attachments`,
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }).then((response) => {
            let apigeeEnvGroupAttachments = response.data as ApigeeEnvGroupAttachmentResponse;
            let envGroupAttachments: EnvironmentGroupAttachment[] = apigeeEnvGroupAttachments.environmentGroupAttachments;

            resolve(envGroupAttachments);
          }).catch((error) => {
            reject(error);
          });
        });
      });
    });
  }

  /**
   * Uploads and updates a proxy bundle to an org, creating a new version that can be deployed
   * @date 2/9/2022 - 8:30:43 AM
   *
   * @param {string} proxyName The name of the proxy (will be created or updated if it already exists)
   * @param {string} bundlePath The path to the bundle zip file
   * @returns {Promise<ProxyRevision>} New proxy revision update information
   */
  updateProxy(proxyName: string, bundlePath: string): Promise<ProxyRevision> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          const form = new FormData();
          form.append('file', fs.createReadStream(bundlePath), `${proxyName + ".zip"}`);

          axios.request({
            url: `https://apigee.googleapis.com/v1/organizations/${projectId}/apis?name=${proxyName}&action=import`,
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              ...form.getHeaders()
            },
            data: form
          }).then((response) => {
            let proxyRevision: ProxyRevision = response.data as ProxyRevision;
            resolve(proxyRevision);
          }).catch((error) => {
            reject(error);
          });
        });
      });
    });
  }

  /**
   * Uploads and updates a proxy bundle to an org, creating a new version that can be deployed
   * @date 2/9/2022 - 8:30:43 AM
   *
   * @param {string} proxyName The name of the proxy (will be created or updated if it already exists)
   * @param {string} bundlePath The path to the bundle zip file
   * @returns {Promise<ProxyRevision>} New proxy revision update information
   */
  updateFlow(flowName: string, bundlePath: string): Promise<ProxyRevision> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          const form = new FormData();
          form.append('file', fs.createReadStream(bundlePath), `${flowName + ".zip"}`);

          axios.request({
            url: `https://apigee.googleapis.com/v1/organizations/${projectId}/sharedflows?name=${flowName}&action=import`,
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              ...form.getHeaders()
            },
            data: form
          }).then((response) => {
            let proxyRevision: ProxyRevision = response.data as ProxyRevision;
            resolve(proxyRevision);
          }).catch((error) => {
            reject(error);
          });
        });
      });
    });
  }

  /**
   * Deploys a revision of a proxy to an environment
   * @date 2/9/2022 - 8:31:54 AM
   *
   * @param {string} environmentName The environment to deploy to
   * @param {string} proxyName The name of the proxy to deploy
   * @param {string} proxyRevision The revision of the proxy to deploy
   * @returns {Promise<ProxyDeployment>} Information on the status of the proxy deployment
   */
  deployProxyRevision(environmentName: string, proxyName: string, proxyRevision: string, serviceAccountEmail?: string): Promise<ProxyDeployment> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {

          let url = `https://apigee.googleapis.com/v1/organizations/${projectId}/environments/${environmentName}/apis/${proxyName}/revisions/${proxyRevision}/deployments?override=true`;
          if (serviceAccountEmail)
            url += `&serviceAccount=${serviceAccountEmail}`;

          axios.request({
            url: url,
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }).then((response) => {
            let apigeeDeployment: ProxyDeployment = response.data as ProxyDeployment;
            resolve(apigeeDeployment);
          }).catch((error) => {
            reject(error);
          });
        });
      });
    });
  }

  /**
   * Deploys a revision of a proxy to an environment
   * @date 2/9/2022 - 8:31:54 AM
   *
   * @param {string} environmentName The environment to deploy to
   * @param {string} proxyName The name of the proxy to deploy
   * @param {string} proxyRevision The revision of the proxy to deploy
   * @returns {Promise<ProxyDeployment>} Information on the status of the proxy deployment
   */
  deployFlowRevision(environmentName: string, flowName: string, flowRevision: string, serviceAccountEmail?: string): Promise<ProxyDeployment> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {

          let url = `https://apigee.googleapis.com/v1/organizations/${projectId}/environments/${environmentName}/sharedflows/${flowName}/revisions/${flowRevision}/deployments?override=true`;
          if (serviceAccountEmail)
            url += `&serviceAccount=${serviceAccountEmail}`;

          axios.request({
            url: url,
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }).then((response) => {
            let apigeeDeployment: ProxyDeployment = response.data as ProxyDeployment;
            resolve(apigeeDeployment);
          }).catch((error) => {
            reject(error);
          });
        });
      });
    });
  }

  /**
   * Gets all of the API Products from an org
   * @date 2/9/2022 - 8:34:45 AM
   *
   * @returns {Promise<ApiProducts>} List of API Products
   */
  getApiProducts(): Promise<ApiProducts> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            url: `https://apigee.googleapis.com/v1/organizations/${projectId}/apiproducts?expand=true`,
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }).then((response) => {
            let apigeeProducts: ApigeeApiProducts = response.data as ApigeeApiProducts;
            let products: ApiProducts = {
              apiProducts: []
            };

            if (apigeeProducts && apigeeProducts.apiProduct) {
              apigeeProducts.apiProduct.forEach(apigeeProduct => {
                let apiProduct: ApiProduct = apigeeProduct as ApiProduct;
                if (apigeeProduct.attributes)
                  for (const attr of apigeeProduct.attributes) {
                    if (attr.name === "image") apiProduct.imageUrl = attr.value;
                    else if (attr.name === "spec") apiProduct.specUrl = attr.value;
                    else if (attr.name === "access") apiProduct.access = attr.value;
                    else if (attr.name === "type") apiProduct.type = attr.value;

                    // Also add to general attributes collection
                    apiProduct.attributes[attr.name] = attr.value;
                  }

                products.apiProducts.push(apiProduct);
              });
            }

            resolve(products);
          }).catch((error) => {
            reject(error);
          });
        });
      });
    });
  }

  /**
   * Gets a single API product
   * @date 2/9/2022 - 8:34:45 AM
   *
   * @returns {Promise<ApiProduct>} API product
   */
  getApiProduct(name: string): Promise<ApiProduct> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            url: `https://apigee.googleapis.com/v1/organizations/${projectId}/apiproducts/${name}`,
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }).then((response) => {
            let apigeeProduct: ApigeeApiProduct = response.data as ApigeeApiProduct;
            let product: ApiProduct = apigeeProduct as ApiProduct;

            resolve(product);
          }).catch((error) => {
            reject(error);
          });
        });
      });
    });
  }

  /**
   * Creates a new API Product
   * @date 2/9/2022 - 8:35:55 AM
   *
   * @param {ApiProduct} apiProduct API Product object to create
   * @returns {Promise<ApiProduct>} Created API Product
   */
  createApiProduct(apiProduct: ApiProduct): Promise<ApiProduct> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            url: `https://apigee.googleapis.com/v1/organizations/${projectId}/apiproducts`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            data: apiProduct
          }).then((response) => {
            let apigeeApiProduct: ApigeeApiProduct = response.data as ApigeeApiProduct;
            let apiProduct: ApiProduct = apigeeApiProduct as ApiProduct;

            if (apigeeApiProduct.attributes)
              for (const attr of apigeeApiProduct.attributes) {
                if (attr.name === "image") apiProduct.imageUrl = attr.value;
                if (attr.name === "spec") apiProduct.specUrl = attr.value;
                if (attr.name === "access") apiProduct.access = attr.value;
                if (attr.name === "type") apiProduct.type = attr.value;
              }

            resolve(apiProduct);
          }).catch((error) => {
            if (error.response && error.response.data)
              resolve(error.response.data as ApiProduct);
            else
              reject(error);
          });
        });
      });
    });
  }

  /**
   * Deletes an API Product
   * @date 2/9/2022 - 8:37:41 AM
   *
   * @param {string} apiProductName The API Product to delete
   * @returns {Promise<ApiProduct>} The delted API Product object
   */
  deleteApiProduct(apiProductName: string): Promise<ApiProduct> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/apiproducts/${apiProductName}`,
            "method": "DELETE",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }).then((response) => {
            let apigeeApiProduct: ApigeeApiProduct = response.data as ApigeeApiProduct;
            let apiProduct: ApiProduct = apigeeApiProduct as ApiProduct;

            resolve(apiProduct);
          }).catch((error) => {
            console.error(error);
            resolve(error.response.data as ApiProduct);
          });
        });
      });
    });
  }

  /**
   * Gets all developers
   * @date 2/9/2022 - 8:38:40 AM
   *
   * @returns {Promise<Developers>} Developers object
   */
  getDevelopers(): Promise<Developers> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers?expand=true`,
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }).then((response) => {
            let apigeeDevelopers: ApigeeDevelopers = response.data as ApigeeDevelopers;
            let developers: Developers = {
              developers: []
            };

            if (apigeeDevelopers && apigeeDevelopers.developer) {
              apigeeDevelopers.developer.forEach(apigeeDeveloper => {
                developers.developers.push(apigeeDeveloper as Developer);
              });
            }

            resolve(developers)
          });
        });
      });
    });
  }

  /**
   * Get a single developer
   * @date 2/9/2022 - 8:39:36 AM
   *
   * @param {string} email The email of the developer account to get
   * @returns {Promise<Developer>} The developer object
   */
  getDeveloper(email: string): Promise<Developer> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}`,
            "method": "get",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
          ).then((response) => {
            let apigeeDeveloper: ApigeeDeveloper = response.data as ApigeeDeveloper;
            let developer: Developer = apigeeDeveloper as Developer;
            resolve(developer);
          }).catch((error) => {
            //console.error(error);
            if (error.response && error.response.data)
              resolve(error.response.data as Developer);
            else
              reject(error);
          });
        });
      });
    });
  }

  /**
   * Creates a developer account
   * @date 2/9/2022 - 8:40:24 AM
   *
   * @param {Developer} developerData The developer data of the account to create
   * @returns {Promise<Developer>} The developer object
   */
  createDeveloper(developerData: Developer): Promise<Developer> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers`,
            "method": "POST",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            "data": developerData
          }
          ).then((response) => {
            let apigeeDeveloper: ApigeeDeveloper = response.data as ApigeeDeveloper;
            let developer: Developer = apigeeDeveloper as Developer;

            resolve(developer);
          }).catch((error) => {
            //console.error(error);
            if (error.response && error.response.data)
              resolve(error.response.data as Developer);
            else
              reject(error);
          });
        });
      });
    });
  }

  /**
   * Updates a developer account
   * @date 2/9/2022 - 8:42:25 AM
   *
   * @param {Developer} developerData The developer data to update
   * @returns {Promise<Developer>} The updated developer data
   */
  updateDeveloper(developerData: Developer): Promise<Developer> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${developerData.email}`,
            "method": "put",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            "data": developerData
          }
          ).then((response) => {
            let apigeeDeveloper: ApigeeDeveloper = response.data as ApigeeDeveloper;
            let developer: Developer = apigeeDeveloper as Developer;

            resolve(developer);
          }).catch((error) => {
            console.error(error);
            resolve(error.response.data as Developer);
          });
        });
      });
    });
  }

  /**
   * Deletes a developer account
   * @date 2/9/2022 - 8:43:10 AM
   *
   * @param {string} email The email of the developer account
   * @returns {Promise<Developer>} The developer object that was deleted
   */
  deleteDeveloper(email: string): Promise<Developer> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}`,
            "method": "delete",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
          ).then((response) => {
            let apigeeDeveloper: ApigeeDeveloper = response.data as ApigeeDeveloper;
            let developer: Developer = apigeeDeveloper as Developer;

            resolve(developer);
          }).catch((error) => {
            console.error(error);
            resolve(error.response.data as Developer);
          });
        });
      });
    });
  }

  /**
   * Gets all of the apps from a developer account
   * @date 2/9/2022 - 8:43:58 AM
   *
   * @param {string} email The developer email
   * @returns {Promise<Apps>} List of developer apps including credentials and keys
   */
  getApps(email: string): Promise<Apps> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps?expand=true`,
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
          ).then((response) => {
            let apigeeApps: ApigeeApps = response.data as ApigeeApps;
            let apps: Apps = {
              apps: []
            };

            if (apigeeApps.app && apigeeApps.app.length > 0) {
              apigeeApps.app.forEach(apigeeApp => {
                let app: App = apigeeApp as App;

                apps.apps.push(app);
              });
            }

            resolve(apps)
          }).catch((error) => {
            if (error.response && error.response.data)
              resolve(error.response.data as Apps);
            else
              reject(error);
          });
        });
      });
    });
  }

  /**
   * Creates a new developer app
   * @date 2/9/2022 - 8:45:33 AM
   *
   * @param {string} email The email of the developer account
   * @param {string} appName The name of the app
   * @param {string[]} apiProducts The API Products that the app should have access to
   * @returns {Promise<App>} New app data, including first credential and key
   */
  createApp(email: string, appName: string, apiProducts: string[], description: string = ""): Promise<App> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps`,
            "method": "POST",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            "data": {
              name: appName,
              apiProducts: apiProducts,
              attributes: [
                {
                  name: "notes",
                  value: description
                }
              ]
            }
          }
          ).then((response) => {
            let apigeeApp: ApigeeApp = response.data as ApigeeApp;
            let app: App = apigeeApp as App;

            resolve(app);
          }).catch((error) => {
            if (error.response && error.response.data)
              resolve(error.response.data as App);
            else
              reject(error);
          });
        });
      });
    });
  }

  /**
   * Gets an app definition from a developer account
   * @date 2/9/2022 - 8:46:57 AM
   *
   * @param {string} email The email of the developer
   * @param {string} appName The name of the app
   * @returns {Promise<App>} The app data including credentials
   */
  getApp(email: string, appName: string): Promise<App> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}`,
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
          ).then((response) => {
            let apigeeApp: ApigeeApp = response.data as ApigeeApp;
            let app: App = apigeeApp as App;

            resolve(app);
          }).catch((error) => {
            if (error.response && error.response.data)
              resolve(error.response.data as App);
            else
              reject(error);
          });
        });
      });
    });
  }

  /**
   * Updates a developer app object
   * @date 2/9/2022 - 8:48:31 AM
   *
   * @param {string} email The developer email
   * @param {string} appName The name of the app
   * @param {App} app The app definition 
   * @returns {Promise<App>} The updated app object
   */
  updateApp(email: string, appName: string, app: App): Promise<App> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}`,
            "method": "PUT",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            "data": app
          }
          ).then((response) => {
            let apigeeApp: ApigeeApp = response.data as ApigeeApp;
            let app: App = apigeeApp as App;

            resolve(app);
          }).catch((error) => {
            if (error.response && error.response.data)
              resolve(error.response.data as App);
            else
              reject(error);
          });
        });
      });
    });
  }

  /**
   * Updates a developer app object with a new credential key
   * @date 2/9/2022 - 8:48:31 AM
   *
   * @param {string} email The developer email
   * @param {string} appName The name of the app
   * @param {App} app The app definition 
   * @returns {Promise<App>} The updated app object
   */
  addAppCredential(email: string, appName: string, app: App): Promise<App> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}`,
            "method": "POST",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            "data": app
          }
          ).then((response) => {
            let apigeeApp: ApigeeApp = response.data as ApigeeApp;
            let app: App = apigeeApp as App;

            resolve(app);
          }).catch((error) => {
            if (error.response && error.response.data)
              resolve(error.response.data as App);
            else
              reject(error);
          });
        });
      });
    });
  }

  /**
   * Gets credentials from an app
   * @date 2/9/2022 - 8:49:13 AM
   *
   * @param {string} email The developer's email
   * @param {string} appName The name of the app
   * @param {string} keyName The name of the key
   * @returns {Promise<AppCredential>} App credential object
   */
  getAppCredential(email: string, appName: string, keyName: string): Promise<AppCredential> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}/keys/${keyName}`,
            "method": "GET",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
          ).then((response) => {
            let apigeeAppCredential: ApigeeAppCredential = response.data as ApigeeAppCredential;
            let appCredential: AppCredential = apigeeAppCredential as AppCredential;

            resolve(appCredential);
          }).catch((error) => {
            if (error.response && error.response.data)
              resolve(error.response.data as AppCredential);
            else
              reject(error);
          });
        });
      });
    });
  }

  /**
   * Updates an app credential object
   * @date 2/9/2022 - 8:49:42 AM
   *
   * @param {string} email The developer email
   * @param {string} appName The name of the app
   * @param {AppCredential} key The app credential key object
   * @returns {Promise<AppCredential>} Updated app credentials object
   */
  updateAppCredential(email: string, appName: string, key: AppCredential): Promise<AppCredential> {
    return new Promise((resolve, reject) => {

      var deletedProducts = [];

      this.getAppCredential(email, appName, key.consumerKey).then((existingAppCredential) => {
        for (var i = 0; i < existingAppCredential.apiProducts.length; i++) {
          var existingProduct = existingAppCredential.apiProducts[i];
          let tempProd = key.apiProducts.find(prod => prod.apiproduct === existingProduct.apiproduct);
          if (!tempProd) deletedProducts.push(existingProduct.apiproduct);
        }
      }).then(() => {
        // First, take care of deleting any removed producs
        var deletePromises = [];
        deletedProducts.forEach((prod) => {
          deletePromises.push(this.updateAppCredentialRemoveProduct(email, appName, key.consumerKey, prod));
        });

        Promise.all(deletePromises).then(() => {

          var newProductsArray = [];
          for (var i = 0; i < key.apiProducts.length; i++) {
            newProductsArray.push(key.apiProducts[i].apiproduct);
          }

          key.apiProducts = newProductsArray;
          this.getOrg().then((projectId) => {
            this.getToken().then((token) => {
              axios.request({
                "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}/keys/${key.consumerKey}`,
                "method": "PUT",
                "headers": {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                "data": key
              }
              ).then((response) => {
                let apigeeAppCredential: ApigeeAppCredential = response.data as ApigeeAppCredential;
                let appCredential: AppCredential = apigeeAppCredential as AppCredential;

                resolve(appCredential);
              }).catch((error) => {
                if (error.response && error.response.data)
                  resolve(error.response.data as AppCredential);
                else
                  reject(error);
              });
            });
          });
        }).catch((error) => {
          console.error(error);
          reject(error);
        });
      });
    });
  }

  /**
   * Delete a credential from an app
   * @date 2/9/2022 - 8:49:13 AM
   *
   * @param {string} email The developer's email
   * @param {string} appName The name of the app
   * @param {string} keyName The name of the key
   * @returns {Promise<AppCredential>} App credential object
   */
  deleteAppCredential(email: string, appName: string, keyName: string): Promise<AppCredential> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}/keys/${keyName}`,
            "method": "DELETE",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
          ).then((response) => {
            let apigeeAppCredential: ApigeeAppCredential = response.data as ApigeeAppCredential;
            let appCredential: AppCredential = apigeeAppCredential as AppCredential;

            resolve(appCredential);
          }).catch((error) => {
            if (error.response && error.response.data)
              resolve(error.response.data as AppCredential);
            else
              reject(error);
          });
        });
      });
    });
  }


  /**
   * Update an app credential API product affiliation
   * @date 2/9/2022 - 8:51:04 AM
   *
   * @param {string} email The developer email
   * @param {string} appName The name of the app
   * @param {string} keyName The name of the key
   * @param {string[]} apiProducts The list of API products that should be able to be accessed with the credential
   * @returns {Promise<AppCredential>} Updated app credential object
   */
  updateAppCredentialAddProducts(email: string, appName: string, keyName: string, apiProducts: string[]): Promise<AppCredential> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}/keys/${keyName}`,
            "method": "POST",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            "data": {
              apiProducts: apiProducts
            }
          }
          ).then((response) => {
            let apigeeAppCredential: ApigeeAppCredential = response.data as ApigeeAppCredential;
            let appCredential: AppCredential = apigeeAppCredential as AppCredential;

            resolve(appCredential);
          }).catch((error) => {
            if (error.response && error.response.data)
              resolve(error.response.data as AppCredential);
            else
              reject(error);
          });
        });
      });
    });
  }

  /**
   * Updates an app credential to remove an API product
   * @date 2/9/2022 - 8:52:54 AM
   *
   * @param {string} email The developer email
   * @param {string} appName The name of the app
   * @param {string} keyName The name of the credential key
   * @param {string} apiProduct The API product
   * @returns {Promise<AppCredential>} Updated app credential object
   */
  updateAppCredentialRemoveProduct(email: string, appName: string, keyName: string, apiProduct: string): Promise<AppCredential> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}/keys/${keyName}/apiproducts/${apiProduct}`,
            "method": "DELETE",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
          ).then((response) => {
            let apigeeAppCredential: ApigeeAppCredential = response.data as ApigeeAppCredential;
            let appCredential: AppCredential = apigeeAppCredential as AppCredential;

            resolve(appCredential);
          }).catch((error) => {
            if (error.response && error.response.data)
              resolve(error.response.data as AppCredential);
            else
              reject(error);
          });
        });
      });
    });
  }

  /**
   * Deletes an app
   * @date 2/9/2022 - 8:53:40 AM
   *
   * @param {string} email The developer email
   * @param {string} appName The name of the app
   * @returns {Promise<App>} Deleted app object
   */
  deleteApp(email: string, appName: string): Promise<App> {
    return new Promise((resolve, reject) => {
      this.getOrg().then((projectId) => {
        this.getToken().then((token) => {
          axios.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}`,
            "method": "DELETE",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
          ).then((response) => {
            let apigeeApp: ApigeeApp = response.data as ApigeeApp;
            let app: App = apigeeApp as App;

            resolve(app);
          }).catch((error) => {
            if (error.response && error.response.data)
              resolve(error.response.data as App);
            else
              reject(error);
          });
        });
      });
    });
  }
}