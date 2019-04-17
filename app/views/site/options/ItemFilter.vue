<template>
    <div id="filters" class="d-flex mb-5 p-2">
        <span> {{ imageCount }}</span>

        <!-- b-form-input v-model="searchString" type="text" placeholder="Search" class="mr-2" / -->
        <multiselect v-model="typeFilter" :options="typeOptions" :multiple="true" class="mr-2 border border-dark rounded" track-by="value" label="text" placeholder="Filter by Type:"></multiselect>
        <multiselect v-model="authorFilter" :options="authorOptions" :multiple="true" class="mr-2 border border-dark rounded" track-by="value" label="text" placeholder="Filter by Author:"></multiselect>
        <multiselect v-model="sortOrder" :options="sortOptions" class="mr-2 border border-dark rounded" track-by="value" label="text" placeholder="Sort:"></multiselect>
    </div>


</template>

<script>
    export default {

    computed: {
        /*
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
        */

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
    },
    methods: {
        linkGen(pageNum) {
            return '/' + this.currentSite.url + '/content/alltable/' + pageNum
        },
        /*
    ...mapActions('items', [
            'routeLoad'
        ]),
        */
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
    },

}

</script>

<style scoped>

</style>