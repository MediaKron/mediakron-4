<template>
    <div class="content min-h-screen w-full lg:static lg:max-h-full max-w-70 mx-auto lg:overflow-visible ">

        <header class="line-behind mb-4 mt-4">
            <h1>My Content</h1>
        </header>

        <div class="pb-2">

            <b-button-toolbar key-nav aria-label="Toolbar with button groups" class="">

                <b-input-group size="sm" class="w-12 mb-2 mr-1">
                    <b-input-group-text slot="prepend" class="bg-white text-black uppercase">
                        <font-awesome-icon icon="search" class="uppercase" />
                    </b-input-group-text>
                    <b-form-input variant="outline-dark" v-model="search" @keyup.13="doSearch" placeholder="Quick Search" size="sm" />
                    <b-input-group-append>
                        <b-button :disabled="!search" @click="search = ''" size="sm" class="uppercase">Clear</b-button>
                    </b-input-group-append>
                </b-input-group>

                <b-button size="sm" variant="outline-dark" class="mb-2 mr-auto">
                    <font-awesome-icon icon="filter" /> Filter By Type</b-button>
                <b-button :disabled="!addFilter" :to="addFilter({'type': 'all'})" size="sm" class="mb-2 mr-auto">Reset Filter</b-button>

                <b-dropdown class="border-none mb-2 mx-2" size="sm" variant="outline-dark" right>
                    <template slot="button-content" class="px-4">
                        <span class="text-uppercase ml-1 px-1 text-black">
                            <font-awesome-icon icon="cogs" /> Bulk Actions</span>
                    </template>
                    <b-dropdown-item href="#">Delete</b-dropdown-item>
                    <b-dropdown-item href="#">Publish</b-dropdown-item>
                    <b-dropdown-item href="#">Unpublish</b-dropdown-item>
                </b-dropdown>

                <b-form-checkbox v-model="selectAll" size="sm" class="mr-2 mb-2 text-sm text-black" button
                    button-variant="outline-dark" :tabindex="0">
                    <span v-if="selectAll">
                        <font-awesome-icon icon="times" class="pr-1" />Unselect all </span> <span v-else
                        class="text-black">
                        <font-awesome-icon icon="check" class="pr-1" />Select All</span>
                    <b-badge variant="light" class="top-0 ml-2"> 400</b-badge>
                </b-form-checkbox>

            </b-button-toolbar>
            <b-collapse id="types" class="mt-2 mb-2">
                <b-button-group class="flex flex-wrap xl:flex-no-wrap">
                    <b-button v-if="counts.collections > 0" variant="dark" size="sm" class="max-w-10 text-left mb-1 mr-1 flex items-center px-3"
                        v-b-tooltip.hover title="Click to filter by Collections"  :to="addFilter({'type': 'collection'})">
                        <font-awesome-icon icon="folder" /><span class="mr-auto ml-1"> Collections</span>
                        <b-badge variant="light" class="ml-1 bg-white" > {{ counts.collections }}
                        </b-badge>
                    </b-button>
                    <b-button v-if="counts.stories > 0" variant="dark" size="sm" class="max-w-10 text-left mb-1 mr-1 flex items-center px-3"
                        v-b-tooltip.hover title="Click to filter by Stories"  :to="addFilter({'type': 'story'})">
                        <font-awesome-icon icon="file-alt" /><span class="mr-auto ml-1"> Stories</span>
                        <b-badge variant="light" class="ml-1 bg-white ">{{ counts.stories }}
                        </b-badge>
                    </b-button>
                    <b-button v-if="counts.maps > 0" variant="dark" size="sm" class="max-w-10 text-left mb-1 mr-1 flex items-center px-3"
                        v-b-tooltip.hover title="Click to filter by Maps" :to="addFilter({'type': 'map'})">
                        <font-awesome-icon icon="map-marker-alt" /><span class="mr-auto ml-1"> Maps</span>
                        <b-badge variant="light" class="ml-1 bg-white ">{{ counts.maps }}
                        </b-badge>
                    </b-button>
                    <b-button v-if="counts.timelines > 0" variant="dark" size="sm" class="max-w-10 text-left mb-1 mr-1 flex items-center px-3"
                        v-b-tooltip.hover title="Click to filter by Timelines"  :to="addFilter({'type': 'timeline'})">
                        <font-awesome-icon icon="clock" /><span class="mr-auto ml-1"> Timelines</span>
                        <b-badge variant="light" class="ml-1 bg-white ">{{ counts.timelines }}
                        </b-badge>
                    </b-button>
                    <b-button v-if="counts.images > 0" variant="dark" size="sm" class="max-w-10 text-left mb-1 mr-1 flex items-center px-3"
                        v-b-tooltip.hover title="Click to filter by Images" :to="addFilter({'type': 'image'})">
                        <font-awesome-icon icon=image /><span class="mr-auto ml-1"> Images</span>
                        <b-badge variant="light" class="ml-1 bg-white ">{{ counts.images }}</b-badge>
                    </b-button>
                    <b-button v-if="counts.videos > 0" variant="dark" size="sm" class="max-w-10 text-left mb-1 mr-1 flex items-center px-3"
                        v-b-tooltip.hover title="Click to filter by Videos"  :to="addFilter({'type': 'video'})">
                        <font-awesome-icon icon="video" /> <span class="mr-auto ml-1">Videos</span>
                        <b-badge variant="light" class="ml-1 bg-white ">{{ counts.videos }}</b-badge>
                    </b-button>
                    <b-button v-if="counts.files > 0" variant="dark" size="sm" class="max-w-10 text-left mb-1 mr-1 flex items-center px-3"
                        v-b-tooltip.hover title="Click to filter by Files"  :to="addFilter({'type': 'file'})">
                        <font-awesome-icon icon="file" /><span class="mr-auto ml-1"> Files</span>
                        <b-badge variant="light" class="ml-1 bg-white ">{{ counts.files }}</b-badge>
                    </b-button>
                    <b-button v-if="counts.audio > 0" variant="dark" size="sm" class="max-w-10 text-left mb-1 mr-1 flex items-center px-3"
                        v-b-tooltip.hover title="Click to filter by Audio"  :to="addFilter({'type': 'audio'})">
                        <font-awesome-icon icon="volume-up" /><span class="mr-auto ml-1"> Audio</span>
                        <b-badge variant="light" class="ml-1 bg-white ">{{ counts.audio }}
                        </b-badge>
                    </b-button>
                </b-button-group>
            </b-collapse>
        </div>

        <loader v-if="listIsLoading">Loading...</loader>
        <b-table class="mt-1 border border-grey bg-light rounded-lg" v-if="listIsLoaded" :items="items" :busy="isBusy"
            :fields="fields" sortBy="updated_at" sort-desc="true" stacked="md">
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
                {{ items.item.user.display_name }}
            </template>
            <template slot="details" slot-scope="items">
                <b-dropdown variant="link" size="sm" right>
                    <template slot="button-content">
                        <font-awesome-icon icon="info-circle" /> Details
                    </template>
                    <b-dropdown-text href="#">Created: {{ items.item.updated_at }}</b-dropdown-text>
                    <b-dropdown-text href="#">Another item</b-dropdown-text>
                </b-dropdown>

            </template>
            <template slot="status" slot-scope="items">
                <span v-if="items.item.published == 1">Published</span>

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
    import Multiselect from 'vue-multiselect'
    export default Vue.extend({
        components: {
            Loader,
            Multiselect
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
                'counts'
            ]),
            ...mapGetters('users', [
                'userListIsLoading',
                'userListIsLoaded',
                'users'
            ]),

        },

        methods: {
            doSearch(){
                var search = this.search;
                var to = this.$route,
                    path = to.path,
                    query = {};
                Object.assign(query, to.query)
                query.title = search;
                this.$router.push({
                    path: path,
                    query: query
                });
            },
            linkGen(pageNum) {
                return '/' + this.currentSite.uri + '/content/mycontent/' + pageNum
            },
            ...mapActions('items', [
                'routeLoad'
            ]),
            addFilter(options){
                var to = this.$route,
                    path = to.path,
                    query = {};
                Object.assign(query, to.query);
                Object.keys(options).forEach((key) =>{
                    query[key] = options[key]; 
                });
                return { path: path, query: query}
            },
            nameWithLang ({ name, language }) {
                return `${name}`
            }
        },
        data() {
            return {
                search:'',
                fields: {
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
                    select: {
                        label: "Select",
                        sortable: false,
                        class: 'text-center'
                    },
                },
                filter: null,
                isBusy: false,
                selectAll: false,
                value: {
                    name: 'Authors',
                    language: 'JavaScript'
                },
                options: [{
                        name: 'Tim Lindgren',
                        language: 'JavaScript'
                    },
                    {
                        name: 'Jamie Walker',
                        language: 'Ruby'
                    },
                    {
                        name: 'Brad Mering',
                        language: 'Ruby'
                    },
                    {
                        name: 'Joe Smith',
                        language: 'PHP'
                    },
                    {
                        name: 'Sally',
                        language: 'Elixir'
                    }
                ],
            
            }

        },
        watch: {
            '$route.params.page': function (page) {
                this.routeLoad({
                    to: this.$route
                });
            },
            '$route.query': function (page) {
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

    .content .add-content-btn {
        background-color: #0d5e93;
        border-color: #0d5e93;
    }

    .content .multiselect__tags {
        border:none;
        padding-top:2px;
        padding-bottom:0;
        min-height:0 !important;
        margin-left:-1rem;
    }
     .content .multiselect,
     .content .multiselect__select {
         min-height:0 !important
    }

     .content .multiselect__select {
         height: 1.5rem; 
     }

    .content .multiselect__single {
        margin-bottom:0;
    }
</style>