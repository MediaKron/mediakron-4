import axios, { AxiosPromise, CancelToken, AxiosError, AxiosResponse, CancelTokenSource } from 'axios';
import store from '@/store';
import config from '@/config';
import Raven from 'raven-js';

/**
 * Simple utility to apstract API calls
 */
export default {
  request (
    method,
    url,
    data,
    params,
    cancelToken
  ) {
    Raven.captureBreadcrumb({
      category: 'api-request',
      message: 'API Request made',
      data: {
        url,
        data,
        method,
        params,
      },
      level: 'info'
    });

    return axios.request({ url, data, method, params, cancelToken });
  },

  get (url, params, cancelToken) {
    return this.request('get', url, null, params, cancelToken);
  },

  post (url, data, cancelToken) {
    return this.request('post', url, data, cancelToken);
  },

  put (url, data, cancelToken) {
    return this.request('put', url, data, cancelToken);
  },

  delete (url, data, cancelToken) {
    return this.request('delete', url, data, cancelToken);
  },

  init () {
    console.log(config)
    axios.defaults.baseURL = config.API_HOSTNAME;
    console.log(axios.defaults.baseURL)
    const storedToken = localStorage.getItem('user-token');
    if(storedToken){
      this.setToken(storedToken);
    }

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!axios.isCancel(error)) {
          store.dispatch('ERROR', error);
        }

        return Promise.reject(error);
      }
    );

    return this;
  },

  // Intercept the request to make sure the token is injected into the header.
  setToken (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  removeToken () {
    delete axios.defaults.headers.common.Authorization;
  },

  getCancelTokenSource() {
    return axios.CancelToken.source();
  },

  isCancel(value) {
    return axios.isCancel(value);
  },
};