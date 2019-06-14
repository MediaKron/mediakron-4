<template>
    <div class="min-h-screen w-full lg:static lg:max-h-full max-w-6xl mx-auto lg:overflow-visible ">
        <div class="flex mt-4 mb-2">
            <b-button variation="dark" class="mr-auto">
               <font-awesome-icon icon="check" /> Add Selected
            </b-button>
            <b-input-group class="w-xs">
                <b-form-input v-model="search" placeholder="Type to Search" />
                <b-input-group-append>
                    <b-button :disabled="!search" @click="search = ''">Clear</b-button>
                </b-input-group-append>
            </b-input-group>
        </div>
        <loader v-if="listIsLoading">Loading...</loader>
        <b-table 
            v-if="listIsLoaded" 
            :items="items" 
            :fields="fields" 
            sortBy="updated_at" 
            sort-desc="true" 
            stacked="md"
            selectable
            select-mode="multi">
             <template slot="add" slot-scope="items">
              <font-awesome-icon icon="plus-square" @click="add(items.item)" /> Add
            </template>
            <template slot="title" slot-scope="items">
                <b-img v-bind="placeholderImage" blank-color="#777" alt="Placeholder Image" />
                {{ items.item.title }}
            </template>
            <template slot="type" slot-scope="items">
                {{ items.item.type}}
            </template>
        </b-table>

        <!-- b-pagination-nav :link-gen="linkGen" :number-of-pages="lastPage" use-router / -->

    </div>

</template>

<script>
    import Vue from 'vue';
    import {
        mapGetters,
        mapActions
    } from 'vuex';
    import Loader from '@/components/Loader';
    export default Vue.extend({
        components: {
            Loader
        },
        data(){
            return{
                placeholderImage: {
                    blank: true,
                    width: 50,
                    height: 50,
                    class: 'mr-2'
                },
                fields: {
                    add: {
                        label: "Add",
                        sortable: false
                    },
                    title: {
                        label: "Title",
                        sortable: true
                    },
                    type: {
                        label: "Type",
                        sortable: true
                    },
                },
                sort: 'updated_at',
                direction: 'ASC',
                search: '',
                page: 0
            }
        },
        computed: {
            ...mapGetters('sites', [
                'siteIsLoading',
                'siteIsLoaded',
                'basePath',
                'currentSite'
            ]),
            ...mapGetters('items', [
                'listIsLoading',
                'listIsLoaded',
                'items',
                'currentPage',
                'totalItems',
                'lastPage',
                'editItem'
            ]),
        },
        methods: {
            linkGen(pageNum) {
                return '/' + this.currentSite.url + '/content/alltable/' + pageNum
            },
            ...mapActions('items', [
                'loadExceptChildren'
            ]),
            search(){
                this.query();
            },
            query(){
                this.loadExceptChildren({
                    sort: this.sort,
                    search: this.search,
                    direction: this.direction,
                    page: 0
                });
            },
            add(item){
                this.editItem.children.push(item);
                console.log(this.editItem);
            }
        },
        mounted() {
            this.loadExceptChildren({
                sort: this.sort,
                search: this.search,
                direction: this.direction,
                page: 0
            });
        }
    });
</script>

<style>

</style>