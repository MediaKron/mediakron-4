<template>
    <div>
        <div class="w-full">
            <div class="flex">
                <Navigation class="fixed top w-100 z-10"></Navigation>
                <aside class="content-sidebar hidden lg:block pb-16 w-15 bg-dark">
                    <div class="lg:relative lg:sticky top-0 pt-16">
                        <div class="sticky?lg:h-(screen-8) overflow-y-auto">
                            <h3 class="uppercase text-lg mb-4 text-white pl-3 mt-1 ">Filters</h3>
                            <div>
                                <div class="mb-10 flex flex-col">
                                    <b-button variant="dark" size="sm" pressed="true"
                                        class="text-left mb-1 flex items-center px-3">
                                        <font-awesome-icon icon="users" /><span class="mr-auto ml-2"> All Authors</span> <b-badge variant="light">400
                                        </b-badge>
                                    </b-button>
                                    <b-button variant="dark" size="sm" class="text-left mb-1 flex items-center px-3">
                                        <font-awesome-icon icon="user" /> <span class="mr-auto ml-2">My Content Only</span> <b-badge variant="light">30
                                        </b-badge>
                                    </b-button>

                                    <select v-model="authorList">
                                        <option v-for="user in users" v-bind:value="user.id" @click="userFilter">
                                            {{ user.email }}
                                        </option>
                                    </select>

                                  
                                <!-- <multiselect v-model="authorFilter" :options="authorOptions" class="border border-dark rounded z-10 uppercase text-black text-sm" track-by="value" label="text" placeholder="Select Author" selectLabel="Select" deselectLabel="Remove"/> -->
                               </div>    
                            </div>
                            <h3 class="uppercase text-lg sr-only">Content</h3>
                            <div>
                                <div class="mb-3 flex flex-col" vertical>
                                    <b-button variant="dark" size="sm" class="text-left mb-1 flex items-center px-3" pressed="true" @clicked="event">
                                        <font-awesome-icon icon="th-large" /><span class="mr-auto ml-2 flex items-center">All Item Types</span> <b-badge variant="light" class="top-0">400
                                        </b-badge>
                                    </b-button>
                                    <b-button v-if="counts.collections > 0" variant="dark" size="sm" class=" text-left mb-1 flex items-center px-3" >
                                        <font-awesome-icon icon="folder" /><span class="mr-auto ml-2"> Collections</span> <b-badge variant="light">{{counts.collections}}
                                        </b-badge>
                                    </b-button>
                                    <b-button variant="dark" size="sm" class="text-left mb-1 flex items-center px-3">
                                        <font-awesome-icon icon="file-alt" /><span class="mr-auto ml-2"> Stories</span><b-badge variant="light">4
                                        </b-badge>
                                    </b-button>
                                    <b-button variant="dark" size="sm" class="text-left mb-1 flex items-center px-3">
                                        <font-awesome-icon icon="map-marker-alt" /><span class="mr-auto ml-2"> Maps</span> <b-badge variant="light">2
                                        </b-badge>
                                    </b-button>
                                    <b-button variant="dark" size="sm" class="text-left mb-1 flex items-center px-3">
                                        <font-awesome-icon icon="clock" /><span class="mr-auto ml-2"> Timelines</span> <b-badge variant="light">1
                                        </b-badge>
                                    </b-button>
                                    <b-button v-if="counts.images > 0" variant="dark" size="sm" class="text-left mb-1 flex items-center px-3">
                                        <font-awesome-icon icon=image /><span class="mr-auto ml-2"> Images</span> <b-badge variant="light">{{ counts.images }}</b-badge>
                                    </b-button>
                                    <b-button v-if="counts.videos > 0" variant="dark" size="sm" class="text-left mb-1 flex items-center px-3">
                                        <font-awesome-icon icon="video" /> <span class="mr-auto ml-2">Videos</span> <b-badge variant="light">{{ counts.videos }}</b-badge>
                                    </b-button>
                                    <b-button variant="dark" size="sm" class="text-left mb-1 flex items-center px-3">
                                        <font-awesome-icon icon="file" /><span class="mr-auto ml-2"> Files</span> <b-badge variant="light">2</b-badge>
                                    </b-button>
                                    <b-button variant="dark" size="sm" class="text-left mb-1 flex items-center px-3">
                                        <font-awesome-icon icon="volume-up" /><span class="mr-auto ml-2"> Audio</span><b-badge variant="light">1
                                        </b-badge>
                                    </b-button>
                                </div>
                            </div>

                            <b-button class="flex items-center inline-block text-left flex items-center px-3 " variant="dark"
                                :to="basePath + '/content/deleted'" size="sm">
                                <font-awesome-icon icon="trash-alt" />
                                <span class="mr-auto ml-2">Trash</span> <b-badge variant="light">34</b-badge>
                            </b-button>
                        </div>
                    </div>
                </aside>

                <main role="main" id="content-wrapper"
                    class=" min-h-screen w-full mx-auto lg:static lg:max-h-full lg:overflow-visible px-8 mt-20">
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
    import ContentCard from "./ContentCard";
    import Sidebar from "@/components/Sidebar";
    import Multiselect from 'vue-multiselect';
    import Navigation from '@/views/site/Navigation';
    export default Vue.extend({
        components: {
            Multiselect,
            Sidebar,
            ContentCard,
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
            event(){
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
                    users,
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
    .content-sidebar .show > .btn-dark.dropdown-toggle {
        background: #fff;
        color:#000;
        border:none;
        border-radius:0;
        text-transform:uppercase;
    }

    .content-sidebar .btn .badge {
        background: #000;
        color:#fff;
        top:1px;
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