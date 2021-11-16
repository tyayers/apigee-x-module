
const {GoogleAuth} = require('google-auth-library');
const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/cloud-platform'
});

auth.getClient().then((newClient) => {
  newClient.request({
    url: `https://apigee.googleapis.com/v1/organizations/bap-emea-apigee-6/apiproducts?expand=true`,
    method: 'GET'
  }).then((response) => {
    console.log(response);
 
  }).catch((error) => {
    console.error(error);
  });
}).catch((error) => {
  console.error(error);
});

