<template>
    <div>
        <div class="w-full mx-auto ">
            <div class="flex">
                <aside id="sidebar" class="hidden max-w-xs lg:block pb-12 pl-2 bg-dark">
                        <div class="bg-dark text-white mt-3 mr-12 mb-0 ml-4 pb-2 uppercase text-lg border-t-0 border-l-0 border-b-1 border-r-0 border-gray-100 border-solid"><font-awesome-icon icon="th-large" class="mr-1 ml-4" />  Content</div>
                        <b-button variant="link" :to="basePath + '/'" class="bg-white text-black fixed top-0 right-0 ml-auto uppercase flex flex-column content-center justify-center rounded-none mt-3 mr-3"> 
                            <font-awesome-icon icon="times" class="w-auto text-2xl"/> 
                            <span class="text-xs"> Close</span>
                         </b-button>   
                        <div class="lg:relative lg:sticky top-0 pt-2 pl-2 ">
                            <div class="sticky?lg:h-(screen-8) overflow-y-auto">
                                  
                                     <b-nav pills vertical class="sticky?lg:h-(screen-32) overflow-y-auto ">
                                        <b-nav-item class="text-xl" :to="basePath + '/content/mycontent'">
                                            <span class="optionsnav-text">My Content</span>
                                        </b-nav-item>
                                        <b-nav-item class="text-xl" :to="basePath + '/content/all'">
                                            <span class="optionsnav-text">Site Library</span>
                                        </b-nav-item>
                                        <b-nav-item class="text-xl" :to="basePath + '/content/authors'">
                                            <span class="optionsnav-text">Authors</span>
                                        </b-nav-item>
                                        <b-button class="mt-4 mx-2" variant="primary" :to="basePath + '/content/add'">
                                            <font-awesome-icon icon="plus-square" />
                                            <span class="optionsnav-text">Add Content</span>
                                        </b-button>
                            </b-nav>
                            </div>
                        </div>  
                </aside>
               
                <main class="min-h-screen w-full lg:static lg:max-h-full max-w-70 mx-auto lg:overflow-visible ">
                    <header class="line-behind mt-20 mb-4">
                        <h1> Site Library</h1>
                    </header>
                    <div class="flex mt-4 mb-2">
                        <b-input-group class="w-20 mr-auto">
                            <b-form-input v-model="filter" placeholder="Type to Search" />
                            <b-input-group-append>
                                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                            </b-input-group-append>
                        </b-input-group>
                        <!-- <b-button class="ml-2 flex items-center px-4 text-base" variant="dark" size="sm"
                            :to="basePath + '/content/add'">
                            <font-awesome-icon icon="plus" />
                            <span class="text-uppercase ml-1">Add</span>
                        </b-button> -->
                        <b-dropdown class="ml-2" size="sm" variant="outline-dark" right>
                            <template slot="button-content" class="px-4">
                                <span class="text-uppercase ml-1 px-1 ">Bulk Actions</span>
                            </template>
                            <b-dropdown-item href="#">Delete</b-dropdown-item>
                            <b-dropdown-item href="#">Publish</b-dropdown-item>
                            <b-dropdown-item href="#">Unpublish</b-dropdown-item>
                        </b-dropdown>
                        <b-button class="flex items-center ml-2 text-uppercase " variant="outline-dark"
                            :to="basePath + '/content/deleted'" size="sm">
                            <font-awesome-icon icon="trash-alt" />
                            <span class="ml-1">Trash</span>
                        </b-button>
                    </div>
                    <loader v-if="listIsLoading">Loading...</loader>
                    <b-table v-if="listIsLoaded" :items="items" :busy="isBusy" :fields="fields" :filter="filter"
                        @filtered="onFiltered" sortBy="updated_at" sort-desc="true" stacked="md">
                        <template slot="title" slot-scope="items">
                            <b-img v-bind="placeholderImage" blank-color="#777" alt="Placeholder Image" />
                            <router-link :to="items.item.url()" class="font-bold text-1xl">{{ items.item.title }}
                            </router-link>
                        </template>
                        <template slot="type" slot-scope="items">
                            {{ items.item.type}}
                        </template>
                    </b-table>

                    <!-- b-pagination-nav :link-gen="linkGen" :number-of-pages="lastPage" use-router / -->
                </main>
            </div>
        </div>



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
                'lastPage'
            ]),
        },
        methods: {
            linkGen(pageNum) {
                return '/' + this.currentSite.url + '/content/alltable/' + pageNum
            },
            ...mapActions('items', [
                'routeLoad'
            ]),
        },
        data() {
            return {
                fields: {

                    title: {
                        label: "Title",
                        sortable: true
                    },
                    type: {
                        label: "Type",
                        sortable: true
                    },
                    updated_at: {
                        label: "Updated",
                        sortable: true
                    },
                },
                filter: null,
                placeholderImage: {
                    blank: true,
                    width: 50,
                    height: 50,
                    class: 'mr-2'
                },
                isBusy: false,
            }

        },
        watch: {
            '$route.params.page': function (page) {
                this.routeLoad({
                    to: this.$route
                });
            }
        },
        mounted() {
            this.routeLoad({
                to: this.$route,
                site: this.currentSite
            });
        }
    });
</script>

<style>

</style>