import { GetterTree } from 'vuex';

export const getters = {
  /**
   * List
   */
  users: state => state.userList,
  listIsLoading: state => state.listIsLoading,
  listIsLoaded: state => state.listIsLoaded,
  userListIsLoading: state => state.listIsLoading,
  userListIsLoaded: state => state.listIsLoaded,
  listIsError: state => state.listIsError,
  listIsEmpty: state => !(state.userList && state.userList.length > 0 && state.listIsLoading)? true : false,

  /**
   * Current
   */
  currentUser: state => state.currentUser,
  userIsLoading: state => state.userIsLoading,
  userIsLoaded: state => state.userIsLoaded,
  userIsError: state => state.userIsError,
  userIsEmpty: state => !(state.currentUser && state.userIsLoading)? true : false,

  currentPage: state => state.pagination.currentPage,
  totalItems: state => state.pagination.total,
  lastPage: state => state.pagination.lastPage,
};

export default getters;