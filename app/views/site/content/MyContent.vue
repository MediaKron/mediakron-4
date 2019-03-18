<template>
<div>
    <div class="w-full mx-auto px-6">
        <div class="flex">
            <aside id="sidebar" class="hidden min-w-64 max-w-xs lg:block pb-12">
                <div class="lg:relative lg:sticky top-20 border-t-0 border-l-0 border-b-0 border-r-2 border-grey border-solid mr-10 ">
                    <div class="sticky?lg:h-(screen-32) overflow-y-auto pr-4">
                     <b-nav pills vertical>
                        <b-nav-item :to="basePath + '/content/mycontent'">
                            <font-awesome-icon icon="user"/> 
                            <span class="optionsnav-text">My Content</span>
                        </b-nav-item> 
                        <b-nav-item :to="basePath + '/content/all'">
                            <font-awesome-icon icon="th"/> 
                            <span class="optionsnav-text">Site Library</span>
                        </b-nav-item> 
                        <b-nav-item :to="basePath + '/#'">
                            <font-awesome-icon icon="trash-alt"/> 
                            <span class="optionsnav-text">Trash Can</span>
                        </b-nav-item> 
                        <b-nav-item :to="basePath + '/#'">
                            <font-awesome-icon icon="search"/> 
                            <span class="optionsnav-text">Search</span>
                        </b-nav-item> 
                        <b-nav-item >
                             <b-button variant="primary" :to="basePath + '/content/add'"><font-awesome-icon icon="plus-square"/> 
                            <span class="optionsnav-text">Add Content</span>
                        </b-button>
                            
                        </b-nav-item> 
                     </b-nav>  
                     <div id="filters" class="mt-4 p-2">
                        <b-form-input v-model="searchString" type="text" placeholder="Search" class="mr-2 block mb-2" />
                        <multiselect v-model="typeFilter" :options="typeOptions" :multiple="true" class="block mr-2 border border-dark rounded mb-2" track-by="value" label="text" placeholder="Filter by Type:"></multiselect>
                        <multiselect v-model="authorFilter" :options="authorOptions" :multiple="true" class="block mr-2 border border-dark rounded mb-2" track-by="value" label="text" placeholder="Filter by Author:"></multiselect>
                        <multiselect v-model="sortOrder" :options="sortOptions" class="block mr-2 border border-dark rounded" track-by="value" label="text" placeholder="Sort:"></multiselect>
                    </div>
                </div>
                </div>
            </aside>
            <main class="min-h-screen w-full lg:static lg:max-h-full lg:overflow-visible "> 
                <header class="line-behind mt-4 mb-4 pr-4">
                <h1> My Content</h1>
                  </header>

            
            <loader v-if="listIsLoading">Loading...</loader>

           <b-card-group deck class="flex-wrap" v-if="listIsLoaded">
                <span v-for="item in alteredItemList" v-bind:key="item.id">
                    <content-card :item="item"></content-card>
                </span>
            </b-card-group>
            <b-pagination-nav :link-gen="linkGen" :number-of-pages="lastPage" use-router />
            </main>
         </div>
    </div>
    
           
        
</div>

</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import ContentCard from "./ContentCard";
import Multiselect from 'vue-multiselect'
import Loader from '@/components/Loader';
export default  Vue.extend({
     components: {
        Multiselect,
        ContentCard,
        Loader
    },
    computed:{
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
            var sortedItems = this.items.sort(function(a, b) {
                if (this.sortOrder.value == 'newest') {
                    return new Date(a.updated_at) - new Date(b.updated_at);
                } else {
                    return new Date(b.updated_at) - new Date(a.updated_at);
                }
            }.bind(this))

            // Return all items if no filters have been selected
            if (this.authorFilter.length == 0 && this.typeFilter.length == 0) return sortedItems

            // Filter based on type and author
            return sortedItems.filter(function(item) {
                // Filter on typeFilter
                var typeFilterResult = this.typeFilter.find(element => element.value == item.type)
                // Filter on authorFilter
                var authorFilterResult = this.authorFilter.find(element => element.value == item.user_id)
                // Return true only if the item appears meets all filter criteria 
                return !(typeFilterResult === undefined && authorFilterResult === undefined)
            }.bind(this))
        }
    },
    methods:{
        linkGen (pageNum) {
            return '/' + this.currentSite.url + '/content/all/' + pageNum
        },
        ...mapActions('items',[
            'routeLoad'
        ]),
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
            sortOrder: {value: 'newest'},
            sortOptions: [
                {value: 'newest', text: 'Updated: New-Old'},
                {value: 'oldest', text: 'Updated: Old-New'},
            ],
            searchString: '',
        }

    },
    watch: {
        '$route.params.page': function (page) {
            this.routeLoad({to: this.$route});
        }
    },
    mounted(){
        this.routeLoad({to: this.$route, site: this.currentSite});
    }
});

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">

.multiselect,
.multiselect__tags {
    height:35px !important;
}

</style>
