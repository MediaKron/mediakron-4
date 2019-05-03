import { MutationTree } from 'vuex';
import api from '@/store/utils/api';
import { getInitialState } from '@/store/modules/items';
import Item from './item';
import Tag from './tag';

export const mutations = {
    /**
     * Called when the list is loading
     * @param {*} state
     */
    listLoading(state){
        state.listIsLoading = true;
        state.listIsLoaded = false;
        state.listIsFailed = false;
    },

    /**
     * Called after the list has loaded
     * @param {*} state
     */
    listLoaded(state){
        state.listIsLoading = false;
        state.listIsLoaded = true;
        state.listIsFailed = false;
    },

    /**
     * Called with the data to load as the current list
     * @param {*} state
     */
    listLoad(state, data){
        state.itemList = data.data.map(item => new Item(item, state.site));
    },

    /**
     * Called with the data to load as the current list
     * @param {*} state
     */
    setSite(state, site){
        state.site = site;
    },

    /**
     * List Page.  Set the pager information from the request
     * @param {*} state
     */
    listPage(state, data){
        state.pagination.currentPage = data.current_page;
        state.pagination.firstPage = 0;
        state.pagination.lastPage = data.last_page;
        state.pagination.pageSize = data.per_page;
        state.pagination.totalItems = data.total;

        state.count.collection = data.collection | 0;
        state.count.video = data.video | 0;
        state.count.image = data.image | 0;
        state.count.audio = data.audio | 0;
        state.count.file = data.file | 0;
        state.count.map = data.map | 0;
        state.count.timeline = data.timeline | 0;
        state.count.story = data.story | 0;
    },

    /**
     * List Page.  Set the pager information from the request
     * @param {*} state
     */
    listError(state, error){
        console.log(error)
    },

    /**
     * Called when the list is loading
     * @param {*} state
     */
    itemLoading(state){
        state.itemIsLoading = true;
        state.itemIsLoaded = false;
        state.itemIsFailed = false;
    },

    /**
     * Called after the list has loaded
     * @param {*} state
     */
    itemLoaded(state){
        state.itemIsLoading = false;
        state.itemIsLoaded = true;
        state.itemIsFailed = false;
    },

    /**
     * Called with the data to load as the current list
     * 
     * TODO: This will need to handle single item and multiple items.  Right now it doesn't handle the single case well
     * @param {*} state
     */
    itemLoad(state, data){
        console.log('item loaded')
        state.first = new Item(data[0], state.site);
        console.log(state.first)
        console.log(state.first.zoom);
        if(data[1]) state.second = new Item(data[1], state.site);
        if(data[2]) state.third = new Item(data[2], state.site);
    },

    /**
     * List Page.  Set the pager information from the request
     * @param {*} state
     */
    siteError(state, error){
        console.log(error)
    },

    updateItem(state, data){
        state.editPending = true;
        state.first = new Item(data, state.site);
    },

    itemSaving(state){
        state.itemIsSaving = true;
        state.itemIsSaved = false;
        state.itemSaveFailed = false;
    },

    // itemUpdate(state, data){
    //     state.currentItem = new Item(data);
    // },

    itemUpdated(state){
        state.siteIsSaving = false;
        state.siteIsSaved = true;
        state.siteSaveFailed = false;
        state.isEditing = false;
        state.isEditingTags = false;
        state.isCreating = false;
    },

    siteUpdateFailed(state, error){
        state.siteIsSaving = false;
        state.siteIsSaved = false;
        state.siteSaveFailed = true;

    },

    /**
     * Instantate an empty item for "editing"
     */
    createItem(state, type){
        var item = new Item({
            id: false,
            uri: false,
            type: type
        }, state.site);
        state.isEditing = true;
        state.isCreating = true;
        state.editItem = Object.assign({}, item)
        state.first = item;
        state.itemIsLoading = false;
        state.itemIsLoaded = true;
        state.itemIsFailed = false;
    },

    /**
     * Given an item, set the edit state to that item
     * and engage editing mode
     * @param {*} state 
     * @param {*} item 
     */
    editItemSet(state, item) {
        state.isEditing = true;
        state.editItem = Object.assign({}, item)
    },

    editCancel(state, item) {
        state.isEditing = false;
        state.editItem = {}
    },

    uploading(state) {
        state.isUploading = true;
        state.isUploaded = false;
    },
    upload(state, item) {
        // do something with the file
        state.editItem.image = item;
    },
    uploaded(state) {
        state.isUploading = false;
        state.isUploaded = true;
    },

    tagsLoading(state) {
        state.tagsLoading = true;
        state.tagsLoaded = false;
    },
    tagsLoad(state, tags) {
        state.tags = tags.map(tag => new Tag(tag));
    },
    tagsLoaded(state) {
        state.tagsLoading = false;
        state.tagsLoaded = true;
    },

}

export default mutations;