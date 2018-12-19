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
    console.log(data);
    return this.request('post', url, data, cancelToken);
  },

  /**
   * Issue a put request
   * @param {string} url 
   * @param {object} data 
   * @param {} cancelToken 
   */
  put (url, data, cancelToken) {
    return this.request('put', url, data, cancelToken);
  },

  /**
   * Issue a delete request
   * @param {*} url 
   * @param {*} data 
   * @param {*} cancelToken 
   */
  delete (url, data, cancelToken) {
    return this.request('delete', url, data, cancelToken);
  },

  /**
   * initialize the api, set the token from the
   * local storage, and get the base url from the hostname 
   */
  init () {
    axios.defaults.baseURL = config.API_HOSTNAME;
    const token = localStorage.getItem('user-token');
    if(token){
      this.setToken(token);
    }

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!axios.isCancel(error)) {
          //store.dispatch('ERROR', error);
        }
        console.log(error)
        return Promise.reject(error);
      }
    );

    return this;
  },

  /**
   * All requests should have a token.  Set the token on the header
   * @param {string} token 
   */
  setToken (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  /**
   * When we log out, we should remove the token and 
   * reset everything
   */
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