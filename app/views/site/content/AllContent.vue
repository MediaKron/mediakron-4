<template>
    <div class="min-h-screen w-full lg:static lg:max-h-full max-w-70 mx-auto lg:overflow-visible ">
        <header class="line-behind mb-3">
            <h1>Site Library</h1>
        </header>

        <b-button-toolbar class="mb-2 items-center">
             <b-input-group size="sm" class="w-12 mb-2 mr-4 ">
                <b-input-group-text slot="prepend" class="bg-dark text-white uppercase">
                    <font-awesome-icon icon="search" class="uppercase" />
                </b-input-group-text>
                <b-form-input variant="outline-dark" v-model="filter" placeholder="Quick Search" size="sm" />
                <b-input-group-append>
                    <b-button :disabled="!filter" @click="filter = ''" size="sm" class="uppercase">Clear</b-button>
                </b-input-group-append>
            </b-input-group>
            <!-- <div class="active-filters inline-block mr-auto mb-2">
                <span class="pr-2">Active Filters:</span>
                <b-button variant="dark" size="sm" class="text-left mr-2">
                    <font-awesome-icon icon="user" /><span class="pr-2"> AUTHOR: My Content</span> <font-awesome-icon icon="times" />
                </b-button>
                <b-button variant="dark" size="sm" class="text-left mr-2">
                    <font-awesome-icon icon="map-marker-alt" /><span class="pr-2"> TYPE: Map</span><font-awesome-icon icon="times" />
                </b-button>
                </div> -->
             <b-button variant="primary" size="sm" :to="basePath + '/content/add'" class="mb-2">
                <font-awesome-icon icon="plus" />
                <span class="ml-2 uppercase">Add Content</span>
            </b-button>
        </b-button-toolbar>
        
        <b-button-toolbar key-nav aria-label="Toolbar with button groups" class="">
            <b-form-checkbox v-model="selectAll" class="mr-2 text-sm text-black" button button-variant="link":tabindex="0">
                <span v-if="selectAll"><font-awesome-icon icon="times" class="pr-1"/>Unselect all  </span> <span v-else class="text-black"><font-awesome-icon icon="check" class="pr-1"/>Select All</span>
                <b-badge variant="light" class="top-0 ml-2">400</b-badge>
            </b-form-checkbox>

            <b-dropdown class="border-none" size="sm" variant="link" right>
                <template slot="button-content" class="px-4">
                    <span class="text-uppercase ml-1 px-1 text-black">
                        <font-awesome-icon icon="cogs" /> Bulk Actions</span>
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
        </b-button-toolbar>
        <ItemFilter></ItemFilter>

        

        <loader v-if="listIsLoading">Loading...</loader>
        <b-table class="mt-1 border border-grey rounded-lg" v-if="listIsLoaded" :items="items" :busy="isBusy" :fields="fields" :filter="filter"
            sortBy="updated_at" sort-desc="true" stacked="md">
            <template slot="select" slot-scope="items">
                <b-form-checkbox>
                </b-form-checkbox>
            </template>
            <template slot="title" slot-scope="items">
                <b-img :src="items.item.imageUrl('small')" blank-color="#777" alt="" class="h-16 mx-auto pr-2" />
                <router-link :to="basePath + '/' + items.item.uri" class="font-bold text-1xl">{{ items.item.title }}
                </router-link>
            </template>
            <template slot="type" slot-scope="items">
                {{ items.item.type }}
            </template>
            <template slot="author" slot-scope="items">
                author
            </template>
            <template slot="details" slot-scope="items">
                <b-dropdown variant="outline-dark" size="sm" right>
                    <template slot="button-content">
                         <font-awesome-icon icon="info-circle" /> Details
                    </template>
                    <b-dropdown-text href="#">Created: {{ items.item.updated_at }}</b-dropdown-text>
                    <b-dropdown-text href="#">Another item</b-dropdown-text>
                </b-dropdown>
        
            </template>
            <template slot="status" slot-scope="items">
        
            </template>
        </b-table>

        <b-pagination-nav :link-gen="linkGen" :number-of-pages="lastPage" use-router />

    </div>

</template>

<script>
    import Vue from 'vue';
    import {
        mapGetters,
        mapActions
    } from 'vuex';
    import Loader from '@/components/Loader';
    import ItemFilter from '@/views/site/options/ItemFilter'
    export default Vue.extend({
        components: {
            Loader,
            ItemFilter
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
                    select: {
                        label: "Select",
                        sortable: false,
                        class: 'text-center'
                    },
                    title: {
                        label: "Title",
                        sortable: true
                    },
                    type: {
                        label: "Type",
                        sortable: true
                    },
                    author: {
                        label: "Author",
                        sortable: true
                    },
                    updated_at: {
                        label: "Updated",
                        sortable: true
                    },
                    details: {
                        label: "Details",
                        sortable: false
                    },
                    status: {
                        label: "Status",
                        sortable: false
                    },
                },
                filter: null,
                isBusy: false,
                selectAll: false
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
    .thumb {
        width: 75px;
        height: 75px;
    }
</style>