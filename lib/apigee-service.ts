const axios = require('axios');
const {JWT} = require('google-auth-library');
//require ("apigee-types")
import { ApigeeApiProducts, ApigeeApiProduct, ApiProducts, ApiProduct, App, ApigeeDevelopers, ApigeeDeveloper, Developers, Developer, ApigeeApps, ApigeeApp, ApigeeAppCredential, Apps, AppCredential} from "./apigee-types"
import { ApiManagementInterface } from "./apigee-interface";

export class ApigeeService implements ApiManagementInterface {
  apigeeOrganization: string;
  jwtClient: any;

  constructor(email: string, key: string, org: string) {
    this.apigeeOrganization = org;
    this.jwtClient = new JWT(
      email,
      null,
      key.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/cloud-platform']
    );
  }

  getApiProducts(): Promise<ApiProducts> {
    return new Promise((resolve, reject) => {

      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/apiproducts?expand=true`,
            "method": "get",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            }
          }
        ).then((response) => {
          let apigeeProducts: ApigeeApiProducts = response.data as ApigeeApiProducts;
          let products: ApiProducts = {
            apiProducts: []
          };

          apigeeProducts.apiProduct.forEach(apigeeProduct => {
            products.apiProducts.push(apigeeProduct as ApiProduct);
          });

          resolve(products)
        });
      }).catch((error) => {
        reject(error);
      });
    });  
  }

  createApiProduct(apiProduct: ApiProduct): Promise<ApiProduct> {
    return new Promise((resolve, reject) => {
      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/apiproducts`,
            "method": "post",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            "data": apiProduct
          }
        ).then((response) => {
          let apigeeApiProduct: ApigeeApiProduct = response.data as ApigeeApiProduct;
          let apiProduct: ApiProduct = apigeeApiProduct as ApiProduct;

          resolve(apiProduct);
        }).catch((error) => {
          if (error.response && error.response.data)
            resolve(error.response.data as ApiProduct);
          else
            reject(error);
        });
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    });   
  }

  deleteApiProduct(apiProductName: string): Promise<ApiProduct> {
    return new Promise((resolve, reject) => {

      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/apiproducts/${apiProductName}`,
            "method": "delete",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            }
          }
        ).then((response) => {
          let apigeeApiProduct: ApigeeApiProduct = response.data as ApigeeApiProduct;
          let apiProduct: ApiProduct = apigeeApiProduct as ApiProduct;

          resolve(apiProduct);
        }).catch((error) => {
          console.error(error);
          resolve(error.response.data as ApiProduct);
        });
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    });    
  }

  getDevelopers(): Promise<Developers> {
    return new Promise((resolve, reject) => {

      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers?expand=true`,
            "method": "get",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            }
          }
        ).then((response) => {
          let apigeeDevelopers: ApigeeDevelopers = response.data as ApigeeDevelopers;
          let developers: Developers = {
            developers: []
          };

          apigeeDevelopers.developer.forEach(apigeeDeveloper => {
            developers.developers.push(apigeeDeveloper as Developer);
          });

          resolve(developers)
        });
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    });  
  }

  getDeveloper(email: string): Promise<Developer> {
    return new Promise((resolve, reject) => {
      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers/${email}`,
            "method": "get",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
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
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    });  
  }

  createDeveloper(developerData: Developer): Promise<Developer> {
    return new Promise((resolve, reject) => {

      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers`,
            "method": "post",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
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
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    });  
  }

  updateDeveloper(developerData: Developer): Promise<Developer> {
    return new Promise((resolve, reject) => {

      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers/${developerData.email}`,
            "method": "put",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
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
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    });  
  }

  deleteDeveloper(email: string): Promise<Developer> {
    return new Promise((resolve, reject) => {

      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers/${email}`,
            "method": "delete",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
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
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    });    
  }

  getApps(email: string): Promise<Apps> {
    return new Promise((resolve, reject) => {

      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers/${email}/apps?expand=true`,
            "method": "get",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
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
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    }); 
  }

  createApp(email: string, appName: string, apiProducts: string[]): Promise<App> {
    return new Promise((resolve, reject) => {

      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers/${email}/apps`,
            "method": "post",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
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
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    });   
  }

  getApp(email: string, appName: string): Promise<App> {
    return new Promise((resolve, reject) => {
      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers/${email}/apps/${appName}`,
            "method": "get",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
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
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    }); 
  }

  updateApp(email: string, appName: string, app: App): Promise<App> {
    return new Promise((resolve, reject) => {

      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers/${email}/apps/${appName}`,
            "method": "put",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
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
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    }); 
  }
  
  getAppCredential(email: string, appName: string, keyName: string): Promise<AppCredential> {
    return new Promise((resolve, reject) => {
      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers/${email}/apps/${appName}/keys/${keyName}`,
            "method": "get",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
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
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    });   
  }

  
  updateAppCredential(email: string, appName: string, key: AppCredential): Promise<AppCredential> {
    return new Promise((resolve, reject) => {

      var deletedProducts = [];

      this.getAppCredential(email, appName, key.consumerKey).then((existingAppCredential) => {
        for(var i=0; i<existingAppCredential.apiProducts.length; i++) {
          var existingProduct = existingAppCredential.apiProducts[i];
          let tempProd = key.apiProducts.find( prod => prod.apiproduct === existingProduct.apiproduct);
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
          for(var i=0; i<key.apiProducts.length; i++) {
            newProductsArray.push(key.apiProducts[i].apiproduct);
          }

          key.apiProducts = newProductsArray;

          this.getToken().then((token) => {
            axios(
              {
                "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers/${email}/apps/${appName}/keys/${key.consumerKey}`,
                "method": "put",
                "headers": {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + token
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
          }).catch((error) => {
            console.error(error);
            reject(error);
          });
        });
      });
    }); 
  }

  updateAppCredentialAddProducts(email: string, appName: string, keyName: string, apiProducts: string[]): Promise<AppCredential> {
    return new Promise((resolve, reject) => {
      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers/${email}/apps/${appName}/keys/${keyName}`,
            "method": "post",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
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
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    }); 
  }

  updateAppCredentialRemoveProduct(email: string, appName: string, keyName: string, apiProduct: string): Promise<AppCredential> {
    return new Promise((resolve, reject) => {
      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers/${email}/apps/${appName}/keys/${keyName}/apiproducts/${apiProduct}`,
            "method": "delete",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
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
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    }); 
  }

  deleteApp(email: string, appName: string): Promise<App> {
    return new Promise((resolve, reject) => {
      this.getToken().then((token) => {
        axios(
          {
            "url": `https://apigee.googleapis.com/v1/organizations/${this.apigeeOrganization}/developers/${email}/apps/${appName}`,
            "method": "delete",
            "headers": {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
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
      }).catch((error) => {
        console.error(error);
        reject(error);
      });
    }); 
  }

  getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.jwtClient.authorize(function(error, tokens) {
        if (error) {
          console.log("Error making request to generate access token:", error);
          reject("Error getting token: " + error)
        } else if (tokens.access_token === null) {
          console.log("Provided service account does not have permission to generate access tokens");
          reject("Error getting token.");
        } else {
          resolve(tokens.access_token);
        }
      });
    });
  }
}