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
  currentSite: state => state.currentSite,
  siteIsLoading: state => state.siteIsLoading,
  siteIsLoaded: state => state.siteIsLoaded,
  siteIsError: state => state.siteIsError,
  siteIsEmpty: state => !(state.currentSite && state.siteIsLoading)? true : false,

  currentPage: state => state.pagination.currentPage,
  totalItems: state => state.pagination.total,
  lastPage: state => state.pagination.lastPage,
};

export default getters;