<template>
<div>
    
    <b-container fluid class="   layout-sidebar-left ">
    <div class="row">
      <!-- <div class="sidebar-left col-md-4" > -->
        
        <main role="main" class="with-sidebar-left col-md-12" > 
           
            <b-nav pills class="line-behind mb-3">
                <b-nav-item :to="basePath + '/content/mycontent'">
                    <font-awesome-icon icon="user"/> 
                    <span class="optionsnav-text">My Content</span>
                </b-nav-item> 
                <b-nav-item :to="basePath + '/content/all'">
                    <font-awesome-icon icon="th"/> 
                    <span class="optionsnav-text">Site Library</span>
                </b-nav-item> 
                <b-nav-item :to="basePath + '/#'">
                    <font-awesome-icon icon="search"/> 
                    <span class="optionsnav-text">Search</span>
                </b-nav-item> 
                <b-nav-item :to="basePath + '/#'">
                    <font-awesome-icon icon="trash-alt"/> 
                    <span class="optionsnav-text">Deleted</span>
                </b-nav-item> 
                <b-nav-item :to="basePath + '/#'">
                    <font-awesome-icon icon="archive"/> 
                    <span class="optionsnav-text">Archived      </span>
                </b-nav-item>  
            </b-nav>  
           
            <header class="sr-only">
                <h1> All Content</h1>
            </header>

            <div id="filters" class="d-flex mb-5 p-2">
                <b-form-input v-model="searchString" type="text" placeholder="Search" class="mr-2" />
                <multiselect v-model="typeFilter" :options="typeOptions" :multiple="true" class="mr-2 border border-dark rounded" track-by="value" label="text" placeholder="Filter by Type:"></multiselect>
                <multiselect v-model="authorFilter" :options="authorOptions" :multiple="true" class="mr-2 border border-dark rounded" track-by="value" label="text" placeholder="Filter by Author:"></multiselect>
                <multiselect v-model="sortOrder" :options="sortOptions" class="mr-2 border border-dark rounded" track-by="value" label="text" placeholder="Sort:"></multiselect>
          </div>

            <div v-if="listIsLoading">Loading ...</div>
           <b-card-group deck class="flex-wrap" v-if="listIsLoaded">
                <span v-for="item in filteredItems" v-bind:key="item.id">
                    <content-card :item="item"></content-card>
                </span>
            </b-card-group>

        </main>
    </div>
    </b-container>  
</div>

</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import ContentCard from "./ContentCard";
import Multiselect from 'vue-multiselect'
export default  Vue.extend({
     components: {
         Multiselect,
        ContentCard
    },
    computed:{
        ...mapGetters('sites', [
            'siteIsLoading',
            'siteIsLoaded',
            'basePath'
        ]),
        ...mapGetters('items', [
            'listIsLoading',
            'listIsLoaded',
            'items'
        ]),
        filteredItems() {
            if (this.authorFilter.length == 0 && this.typeFilter.length == 0) return this.items

            return this.items.filter(function(item) {
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
            sortOrder: null,
            sortOptions: [
                {value: 'newest', text: 'Updated: New-Old'},
                {value: 'oldest', text: 'Updated: Old-New'},
            ],
            searchString: '',
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
