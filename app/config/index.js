let api = '';
import types from './types';

switch (process.env.NODE_ENV) {
  case 'development':
        api = 'http://localhost:81/';
    break;
  case 'remote_dev':
        api = 'https://dev.api.mediakron.us/';
    break;
  case 'staging':
        api = 'https://stage.mediakron.us/';
    break;
  case 'production':
        api = 'https://mediakron.bu.edu/';
    break;
}

export default {
    API_HOSTNAME: api + 'api',
    STORAGE_PUBLIC: api + 'storage',
    BUILD: process.env.APP_BUILD? process.env.APP_BUILD : '0',
    CONTENT_TYPES: types
};