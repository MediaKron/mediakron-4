<template>
    <div>
        <div class="w-full">
            <div class="flex">
                <Navigation class="fixed top-0 w-full z-10"></Navigation>
                <main role="main" id="content-wrapper" class=" min-h-screen w-full mx-auto mt-10">
                    <b-navbar variant="light" class="section-nav w-full mb-8 pb-0 pt-4">
                        <b-nav tabs class="mt-2 max-w-6xl mx-auto">
                            <b-nav-item active-class="active" :to="basePath + '/content/mycontent'" class="uppercase">My
                                Content </b-nav-item>
                            <b-nav-item active-class="active" :to="basePath + '/content/all'" class="uppercase">Site
                                Library</b-nav-item>
                            <b-nav-item active-class="active" :to="basePath + '/content/authors'"
                                class="uppercase mr-4">Authors</b-nav-item>
                            <b-nav-item active-class="active" :to="basePath + '/content/deleted'" class="">
                                <font-awesome-icon icon="trash-alt" /> Trash</b-nav-item>
                            <b-nav-item active-class="active" :to="basePath + '/content/archived'" class=" ">
                                <font-awesome-icon icon="archive" /> Archived</b-nav-item>
                            <b-nav-item active-class="active" :to="basePath + '/content/import'" class="">
                                <font-awesome-icon icon="cloud-upload-alt" /> Import</b-nav-item>
                            <b-nav-item active-class="active" :to="basePath + '/content/export'" class="mr-4 ">
                                <font-awesome-icon icon="cloud-download-alt" /> Export</b-nav-item>
                            <b-nav-item active-class="active" class="-mt-2 -mr-2 p-0">
                                <b-button variant="primary" size="sm" class="max-w-xs" :to="basePath + '/content/add'">
                                    <font-awesome-icon icon="plus" />
                                    <span class="ml-2 uppercase">Add Content</span>
                                </b-button>
                            </b-nav-item>
                        </b-nav>
                    </b-navbar>
                    <transition name="fade">
                        <router-view></router-view>
                    </transition>
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
    import Sidebar from "@/components/Sidebar";
    import Multiselect from 'vue-multiselect';
    import Navigation from '@/views/site/Navigation';
    export default Vue.extend({
        components: {
            Multiselect,
            Sidebar,
            Navigation
        },
        computed: {

            ...mapGetters('sites', [
                'siteIsLoading',
                'siteIsLoaded',
                'basePath'
            ]),
            ...mapGetters('items', [
                'listIsLoading',
                'listIsLoaded',
                'items',
                'counts'
            ]),
            ...mapGetters('users', [
                'listIsLoading',
                'listIsLoaded',
                'users'
            ]),
            filteredItems() {
                return this.items.filter(function (item) {
                    return this.typeFilter.indexOf(item.type) == -1
                }.bind(this))
            },
            userFilter: function () {
                /*
                var vm = this;
                return function (keyname) {
                    var output = [];
                    var keys   = [];

                    vm.users.forEach(function (user) {
                        var key = user[keyname];

                        if (keys.indexOf(key) === -1) {
                            keys.push(key);
                            output.push(user);
                        }
                    });
                    */

                return true
                //}
            },

            objList() {
                return this.list.map((item) => Object.keys(item))
            },

            keyValuePair() {
                return this.list.map((item) => {
                    return Object.keys(item).reduce((acc, curr) => {
                        acc.push(`${curr} - ${item[curr]}`)
                        return acc
                    }, [])
                })
            }
        },

        methods: {
            event() {
                console.log('my event')
            },
            ...mapActions('items', [
                'routeLoad'
            ]),
        },
        data() {
            return {
                typeFilter: [],
                typeOptions: [
                    'layer',
                    'image',
                    'image-map',
                    'folder',
                ],
                authorFilter: null,
                /* to do: get the list of authors from userList */
                authorOptions: [{
                        value: null,
                        text: 'Select Author'
                    },
                    {
                        value: 'jamie',
                        text: 'Jamie'
                    },
                    {
                        value: 'tim',
                        text: 'Tim'
                    },
                    {
                        value: 'austn',
                        text: 'Austin'
                    },
                    {
                        value: 'brad',
                        text: 'Brad'
                    },
                ],

                sortOrder: null,
                sortOptions: [{
                        value: null,
                        text: 'Sort Preference:'
                    },
                    {
                        value: 'newest',
                        text: 'Updated: New-Old'
                    },
                    {
                        value: 'oldest',
                        text: 'Updated: Old-New'
                    },
                ],
                searchString: '',
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

<style post-css>
    .content-sidebar .svg-inline--fa {
        @apply w-4;
    }

    .content-sidebar .multiselect__placeholder {
        color: #000;
        margin-bottom: 0;
    }

    .content-sidebar .btn-dark:not(:disabled):not(.disabled):active,
    .content-sidebar .btn-dark:not(:disabled):not(.disabled).active,
    .content-sidebar .show>.btn-dark.dropdown-toggle {
        background: #fff;
        color: #000;
        border: none;
        border-radius: 0;
        text-transform: uppercase;
    }

    .content-sidebar .btn .badge {
        background: #000;
        color: #fff;
        top: 1px;
    }


    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter,
    .fade-leave-to

    /* .fade-leave-active below version 2.1.8 */
        {
        opacity: 0;
    }
</style>