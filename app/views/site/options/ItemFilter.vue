<template>
    <b-collapse id="types" class="mt-2 mb-2">
        <span></span>
        <b-button-group class="flex flex-wrap xl:flex-no-wrap">
            <span v-for="type in types" v-bind:key="type">
                <b-button v-if="counts[type] > 0" variant="dark" size="sm" class="max-w-xs text-left mb-1 mr-1 flex items-center px-3"
                        v-b-tooltip.hover :title="buttonAction + type_settings[type].name" :to="addFilter(type)">
                    <font-awesome-icon :icon="type_settings[type].icon" /><span class="mr-auto ml-1"> {{ type_settings[type].name }}</span>
                    <b-badge variant="light" class="ml-1 bg-white" > {{ counts[type] }}
                    </b-badge>
                </b-button>
            </span>

        </b-button-group>

    </b-collapse>
</template>

<script>
    import {
        mapGetters,
        mapActions,
        mapState
    } from 'vuex';
    import config from '@/config';
    export default {

        computed: {
            ...mapState('items', [
                'count'
            ]),
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
        addFilter(value){
            var to = this.$route,
                path = to.path,
                query = {},
                type = to.query.type || false;
            
            Object.assign(query, to.query);

            if(!type || type != value){
                query.type = value;
                this.buttonAction = 'Filter content by '
            }else{
                this.buttonAction = 'Remove filter by ';
                delete query.type;
            }
            return {
                path: path,
                query: query
            }
        },
    },
    mounted(){
        console.log(config)
    },
    data() {
        return {
            types: config.CONTENT_TYPES.list,
            type_settings: config.CONTENT_TYPES.settings,
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
            buttonAction: 'Filter content by ',
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