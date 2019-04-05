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

    return axios.request({ 
      url: url, 
      data: data, 
      method: method, 
      params: params, 
      cancelToken: cancelToken
    });
  },

  get (url, params, cancelToken) {
    return this.request('get', url, null, params, cancelToken);
  },

  post (url, data, cancelToken) {
    return this.request('post', url, data, cancelToken);
  },

  /**
   * Upload a file to a site
   * @param {*} url 
   * @param {*} file 
   * @param {*} type 
   */
  upload(url, file, type) {
    store.dispatch('progressReset')
    let formData = new FormData();
    formData.append(type, file);
    return axios.request({ 
      url: url, 
      data: formData, 
      method: 'post', 
      headers: { 'Content-Type': 'multipart/form-data' },
      // `onUploadProgress` allows handling of progress events for uploads
      onUploadProgress: function (progressEvent) {
        // Do whatever you want with the native progress event
        store.dispatch('uploadProgress', progressEvent)
      }
    });
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