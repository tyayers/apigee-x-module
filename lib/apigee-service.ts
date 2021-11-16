const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');
const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

import { ApigeeApiProducts, ApigeeApiProduct, ApiProducts, ApiProduct, App, ApigeeDevelopers, ApigeeDeveloper, Developers, Developer, ApigeeApps, ApigeeApp, ApigeeAppCredential, Apps, AppCredential } from "./apigee-types"
import { ApiManagementInterface } from "./apigee-interface";

export class ApigeeService implements ApiManagementInterface {

  getApiProducts(): Promise<ApiProducts> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            url: `https://apigee.googleapis.com/v1/organizations/${projectId}/apiproducts?expand=true`,
            method: 'GET'
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
                    if (attr.name === "spec") apiProduct.specUrl = attr.value;
                    if (attr.name === "access") apiProduct.access = attr.value;
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

  createApiProduct(apiProduct: ApiProduct): Promise<ApiProduct> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            url: `https://apigee.googleapis.com/v1/organizations/${projectId}/apiproducts`,
            method: "post",
            headers: {
              "Content-Type": "application/json"
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

  deleteApiProduct(apiProductName: string): Promise<ApiProduct> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/apiproducts/${apiProductName}`,
            "method": "delete",
            "headers": {
              "Content-Type": "application/json"
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

  getDevelopers(): Promise<Developers> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers?expand=true`,
            "method": "get",
            "headers": {
              "Content-Type": "application/json"
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

  getDeveloper(email: string): Promise<Developer> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}`,
            "method": "get",
            "headers": {
              "Content-Type": "application/json"
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

  createDeveloper(developerData: Developer): Promise<Developer> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers`,
            "method": "post",
            "headers": {
              "Content-Type": "application/json"
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

  updateDeveloper(developerData: Developer): Promise<Developer> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${developerData.email}`,
            "method": "put",
            "headers": {
              "Content-Type": "application/json"
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

  deleteDeveloper(email: string): Promise<Developer> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}`,
            "method": "delete",
            "headers": {
              "Content-Type": "application/json"
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

  getApps(email: string): Promise<Apps> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps?expand=true`,
            "method": "get",
            "headers": {
              "Content-Type": "application/json"
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

  createApp(email: string, appName: string, apiProducts: string[]): Promise<App> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps`,
            "method": "post",
            "headers": {
              "Content-Type": "application/json"
            },
            "data": {
              name: appName,
              apiProducts: apiProducts
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

  getApp(email: string, appName: string): Promise<App> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}`,
            "method": "get",
            "headers": {
              "Content-Type": "application/json"
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

  updateApp(email: string, appName: string, app: App): Promise<App> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}`,
            "method": "put",
            "headers": {
              "Content-Type": "application/json"
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

  getAppCredential(email: string, appName: string, keyName: string): Promise<AppCredential> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}/keys/${keyName}`,
            "method": "get",
            "headers": {
              "Content-Type": "application/json"
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
          auth.getProjectId().then((projectId) => {
            auth.getClient().then((client) => {
              client.request({
                "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}/keys/${key.consumerKey}`,
                "method": "put",
                "headers": {
                  "Content-Type": "application/json"
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

  updateAppCredentialAddProducts(email: string, appName: string, keyName: string, apiProducts: string[]): Promise<AppCredential> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}/keys/${keyName}`,
            "method": "post",
            "headers": {
              "Content-Type": "application/json"
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

  updateAppCredentialRemoveProduct(email: string, appName: string, keyName: string, apiProduct: string): Promise<AppCredential> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${projectId}/developers/${email}/apps/${appName}/keys/${keyName}/apiproducts/${apiProduct}`,
            "method": "delete",
            "headers": {
              "Content-Type": "application/json"
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

  deleteApp(email: string, appName: string): Promise<App> {
    return new Promise((resolve, reject) => {
      auth.getProjectId().then((projectId) => {
        auth.getClient().then((client) => {
          client.request({
            "url": `https://apigee.googleapis.com/v1/organizations/${client.projectId}/developers/${email}/apps/${appName}`,
            "method": "delete",
            "headers": {
              "Content-Type": "application/json"
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