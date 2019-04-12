<template>
    <div class="min-h-screen w-full lg:static lg:max-h-full max-w-70 mx-auto lg:overflow-visible ">
        <header class="line-behind mb-4">
            <h1> Site Library</h1>
        </header>
        <div class="mt-4 mb-2">

            <b-button-toolbar key-nav aria-label="Toolbar with button groups" class="mr-auto">
                <b-button-group class="mb-2">
                    <b-button variant="outline-dark" size="sm" pressed="true" class="uppercase">
                        <font-awesome-icon icon="users" /> All Authors <b-badge variant="light">12</b-badge>
                    </b-button>
                    <b-button variant="outline-dark" size="sm" class="uppercase">
                        <font-awesome-icon icon="user" /> My Content <b-badge variant="light">4</b-badge>
                    </b-button>
                    <b-dropdown size="sm" variant="outline-dark" right>
                        <template slot="button-content" class="px-4">
                            <span class="text-uppercase ml-1 px-1 ">Select Author</span>
                        </template>
                        <b-dropdown-item href="#">Delete</b-dropdown-item>
                        <b-dropdown-item href="#">Publish</b-dropdown-item>
                        <b-dropdown-item href="#">Unpublish</b-dropdown-item>
                    </b-dropdown>
                </b-button-group>
            </b-button-toolbar>

            <b-button-toolbar key-nav aria-label="Toolbar with button groups" class="mr-auto">
                <b-button-group class="mb-2" justified>
                    <b-button variant="outline-dark" size="sm" class="uppercase" pressed="true">
                        <font-awesome-icon icon="th-large" /> All Content <b-badge variant="light">400</b-badge>
                    </b-button>
                    <b-button variant="outline-dark" size="sm" class="uppercase">
                        <font-awesome-icon icon="folder" /> Collections <b-badge variant="light">12</b-badge>
                    </b-button>
                    <b-button variant="outline-dark" size="sm" class="uppercase">
                        <font-awesome-icon icon="file-alt" /> Stories <b-badge variant="light">4</b-badge>
                    </b-button>
                    <b-button variant="outline-dark" size="sm" class="uppercase">
                        <font-awesome-icon icon="map-marker-alt" /> Maps <b-badge variant="light">2</b-badge>
                    </b-button>
                    <b-button variant="outline-dark" size="sm" class="uppercase">
                        <font-awesome-icon icon="clock" /> Timelines <b-badge variant="light">1</b-badge>
                    </b-button>
                    <b-button variant="outline-dark" size="sm" class="uppercase">
                        <font-awesome-icon icon=image /> Images <b-badge variant="light">12</b-badge>
                    </b-button>
                    <b-button variant="outline-dark" size="sm" class="uppercase">
                        <font-awesome-icon icon="video" /> Videos <b-badge variant="light">4</b-badge>
                    </b-button>
                    <b-button variant="outline-dark" size="sm" class="uppercase">
                        <font-awesome-icon icon="file" /> Files <b-badge variant="light">2</b-badge>
                    </b-button>
                    <b-button variant="outline-dark" size="sm" class="uppercase">
                        <font-awesome-icon icon="volume-up" /> Audio <b-badge variant="light">1</b-badge>
                    </b-button>
                </b-button-group>
            </b-button-toolbar>
            <b-button-toolbar key-nav aria-label="Toolbar with button groups" class="mr-auto">
                <b-input-group size="sm" class="w-16">
                    <b-input-group-text slot="prepend" class="bg-dark text-white uppercase">
                        <font-awesome-icon icon="search" class="mr-2 uppercase" />Search</b-input-group-text>
                    <b-form-input variant="outline-dark" v-model="filter" placeholder="Type to Search" size="sm" />
                    <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''" size="sm" class="uppercase">Clear</b-button>
                    </b-input-group-append>
                </b-input-group>

                <b-dropdown class="ml-2" size="sm" variant="outline-dark" right>
                    <template slot="button-content" class="px-4">
                        <span class="text-uppercase ml-1 px-1 ">
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

        </div>
        <loader v-if="listIsLoading">Loading...</loader>
        <b-table v-if="listIsLoaded" :items="items" :busy="isBusy" :fields="fields" :filter="filter"
            @filtered="onFiltered" sortBy="updated_at" sort-desc="true" stacked="md">
            <template slot="title" slot-scope="items">
                <b-img :src="items.item.imageUrl('small')" blank-color="#777" alt="" class="h-10 mx-auto pr-2" />
                <router-link :to="items.item.uri" class="font-bold text-1xl">{{ items.item.title }}
                </router-link>
            </template>
            <template slot="type" slot-scope="items">
                {{ items.item.type }}
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
    .thumb {
        width: 75px;
        height: 75px;
    }
</style>