let api = '';
console.log(process.env)
switch (process.env.NODE_ENV) {
  case 'development':
        api = 'http://localhost/api';
    break;
  case 'remote_dev':
        api = 'https://dev.mediakron.us/api';
    break;
  case 'staging':
        api = 'https://stage.mediakron.us/api';
    break;
  case 'production':
        api = 'https://mediakron.bc.edu/api';
    break;
}

export default {
    API_HOSTNAME: api,
    BUILD: process.env.APP_BUILD? process.env.APP_BUILD : '0',
};