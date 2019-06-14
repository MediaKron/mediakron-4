<template>
    <div class="min-h-screen w-full lg:static lg:max-h-full max-w-2xl mx-auto lg:overflow-visible ">
        <header class="line-behind mb-4">
            <h1>Add Content</h1>
        </header>
        <h2 class="mb-4">Content Organizers</h2>
         <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full" :to="basePath + '/content/add/folder'">
                <font-awesome-icon icon="folder" /><span class="mr-auto ml-2"> Collections</span>
            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>
        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full" :to="basePath + '/content/add/story'">
                <font-awesome-icon icon="file-alt" /><span class="mr-auto ml-2"> Stories</span>
            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>

        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full" :to="basePath + '/content/add/map'">
                <font-awesome-icon icon="map-marker-alt" /><span class="mr-auto ml-2"> Maps</span>
            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>

        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full" :to="basePath + '/content/add/timeline'">
                <font-awesome-icon icon="clock" /><span class="mr-auto ml-2"> Timelines</span>
            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>
        <h2 class="mt-5 mb-4">Individual Media</h2>
         <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full" :to="basePath + '/content/add/image'">
                <font-awesome-icon icon=image /><span class="mr-auto ml-2"> Images</span>

            </b-button>
                        <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>

        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full" :to="basePath + '/content/add/video'">
                <font-awesome-icon icon="video" /> <span class="mr-auto ml-2">Videos</span>

            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>

        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full" :to="basePath + '/content/add/video'">
                <font-awesome-icon icon="file" /><span class="mr-auto ml-2"> Files</span>

            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>

        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full"
                :to="basePath + '/content/add/audio'">
                <font-awesome-icon icon="volume-up" /><span class="mr-auto ml-2"> Audio</span>

            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>


       

       
    </div>

</template>

<script>
    import Vue from 'vue';
    import {
        mapGetters,
        mapActions
    } from 'vuex';
    import Multiselect from 'vue-multiselect'
    export default Vue.extend({
        components: {
            Multiselect,
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
            alteredItemList() {
                // Sort based on updated_at 
                var sortedItems = this.items.sort(function (a, b) {
                    if (this.sortOrder.value == 'newest') {
                        return new Date(a.updated_at) - new Date(b.updated_at);
                    } else {
                        return new Date(b.updated_at) - new Date(a.updated_at);
                    }
                }.bind(this))

                // Return all items if no filters have been selected
                if (this.authorFilter.length == 0 && this.typeFilter.length == 0) return sortedItems

                // Filter based on type and author
                return sortedItems.filter(function (item) {
                    // Filter on typeFilter
                    var typeFilterResult = this.typeFilter.find(element => element.value == item.type)
                    // Filter on authorFilter
                    var authorFilterResult = this.authorFilter.find(element => element.value == item
                        .user_id)
                    // Return true only if the item appears meets all filter criteria 
                    return !(typeFilterResult === undefined && authorFilterResult === undefined)
                }.bind(this))
            }
        },
        methods: {
            linkGen(pageNum) {
                return '/' + this.currentSite.url + '/content/all/' + pageNum
            },
            ...mapActions('items', [
                'routeLoad'
            ]),
        },
        data() {
            return {
                typeFilter: [],
                typeOptions: [{
                        value: 'image',
                        text: 'Image'
                    },
                    {
                        value: 'image-map',
                        text: 'Image Map'
                    },
                    {
                        value: 'folder',
                        text: 'Folder'
                    },
                    {
                        value: 'audio',
                        text: 'Audio'
                    },
                    {
                        value: 'video',
                        text: 'Video'
                    },
                    {
                        value: 'story',
                        text: 'Story'
                    },
                    {
                        value: 'slideshow',
                        text: 'Slideshow'
                    },
                ],
                authorFilter: [],
                authorOptions: [{
                        value: 4,
                        text: 'Jamie'
                    },
                    {
                        value: 1,
                        text: 'Tim'
                    },
                    {
                        value: 2,
                        text: 'Austin'
                    },
                    {
                        value: 0,
                        text: 'Brad'
                    },
                ],
                sortOrder: {
                    value: 'newest'
                },
                sortOptions: [{
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

<style src="vue-multiselect/dist/vue-multiselect.min.css">
    .multiselect,
    .multiselect__tags {
        height: 35px !important;
    }
</style>