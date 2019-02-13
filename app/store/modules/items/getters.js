import { GetterTree } from 'vuex';

export const getters = {
    /**
     * * List
    */
    items: state => state.itemList,

    listIsLoading: state => state.listIsLoading,
    listIsLoaded: state => state.listIsLoaded,
    listIsError: state => state.listIsError,
    listIsEmpty: state => !(state.itemList && state.itemList.length > 0 && state.listIsLoading)? true : false,

    /**
     * Current
     */
    currentItem: state => state.currentItem,
    itemIsLoading: state => state.itemIsLoading,
    itemIsLoaded: state => state.itemIsLoaded,
    itemIsError: state => state.itemIsError,
    itemIsEmpty: state => !(state.currentItem && state.itemIsLoading)? true : false,

    currentPage: state => state.pagination.currentPage,
    totalItems: state => state.pagination.total,
    lastPage: state => state.pagination.lastPage,

    getState: state => state,
};

export default getters;