import { GetterTree } from 'vuex';

export const getters = {
  /**
   * List
   */
  sites: state => state.siteList,
  listIsLoading: state => state.listIsLoading,
  listIsLoaded: state => state.listIsLoaded,
  listIsError: state => state.listIsError,
  listIsEmpty: state => !(state.siteList && state.siteList.length > 0 && state.listIsLoading)? true : false,

  /**
   * Current
   */
  current: state => state.currentSite,
  currentIsLoading: state => state.currentIsLoading,
  currentIsLoaded: state => state.currentIsLoaded,
  currentIsError: state => state.currentIsError,
  currentIsEmpty: state => !(state.currentSite && state.currentIsLoading)? true : false,
};

export default getters;