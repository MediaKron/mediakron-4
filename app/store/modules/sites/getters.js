import { GetterTree } from 'vuex';

export const getters = {
  /**
   * List
   */
  listIsLoading: state => state.listStatus === LocationsStatus.Loading? true : false,
  listIsLoaded: state => state.listStatus === LocationsStatus.Loaded? true : false,
  listIsError: state => state.listStatus === LocationsStatus.Failed? true : false,
  listIsEmpty: state => !(state.locationsList && state.locationsList.length > 0 && state.listStatus !== LocationsStatus.Loading)? true : false,

  /**
   * Current
   */
  currentIsLoading: state => state.listStatus === LocationsStatus.Loading? true : false,
  currentIsLoaded: state => state.listStatus === LocationsStatus.Loaded? true : false,
  currentIsError: state => state.listStatus === LocationsStatus.Failed? true : false,
  currentIsEmpty: state => !(state.locationsList && state.locationsList.length > 0 && state.listStatus !== LocationsStatus.Loading)? true : false,
};

export default getters;