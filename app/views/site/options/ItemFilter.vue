<template>
    <b-collapse id="types" class="mt-2 mb-2">
        <b-button-group class="flex flex-wrap xl:flex-no-wrap">
            <b-button v-if="counts.collections > 0" variant="dark" size="sm" class="max-w-10 text-left mb-1 mr-1 flex items-center px-3"
                      v-b-tooltip.hover title="Click to filter by Stories" :to="addFilter({'type': 'collection'})">
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
</template>

<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex';

    export default {

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
        },
/*
        filteredItems() {
            if (this.typeFilter.length == 0) return this.items
            return this.items.filter(function(item) {
                // Filter on typeFilter
                var typeFilterResult = this.typeFilter.find(element => element.value == item.type)
                // Filter on authorFilter
                //var authorFilterResult = this.authorFilter.find(element => element.value == item.user_id)
                // Return true only if the item appears meets all filter criteria
                return !(typeFilterResult === undefined)
            }.bind(this))
        },
        */

    methods: {
        linkGen(pageNum) {
            return '/' + this.currentSite.url + '/content/myContent/' + pageNum
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
            return {
                path: path,
                query: query,
                filtered:true
            }
        },
    },
    data() {
        return {
            typeFilter: [],
            typeOptions: [
                {value:'image', text: 'Image'},
                {value:'image-map', text: 'Image Map'},
                {value:'folder', text: 'Folder'},
                {value:'audio', text: 'Audio'},
                {value:'video', text: 'Video'},
                {value:'story', text: 'Story'},
                {value:'slideshow', text: 'Slideshow'},
            ],
            sortOrder: [],
            sortOptions: [
                {value:'ASC', text: 'oldest to recent'},
                {value:'DESC', text: 'recent to oldest'},
            ],
            authorFilter: [],
            authorOptions: [
                {value: 4, text: 'Jamie'},
                {value: 1, text: 'Tim'},
                {value: 2, text: 'Austin'},
                {value: 0, text: 'Brad'},
            ],
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
            filtered: null,
            placeholderImage: {
                blank: true,
                width: 50,
                height: 50,
                class: 'mr-2'
            },
            isBusy: false,
        }

    },

}

</script>

<style scoped>

</style>