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
                <h1> My Content</h1>
            </header>

            <div id="filters" class="d-flex mb-5 p-2">
           
                <b-form-input v-model="searchString" type="text" placeholder="Search" class="mr-2" />
                <!--  <b-form-select v-model="typeFilter" :options="typeOptions" class="mb-3" /> -->
                <multiselect v-model="typeFilter" :options="typeOptions" :multiple="true" class="mr-2 border border-dark rounded"></multiselect>
                <b-form-select v-model="authorFilter" :options="authorOptions" class="mr-2" />
                <b-form-select v-model="sortOrder" :options="sortOptions" class="mr-2" />
            
                <!--
                <div>Searched: {{ searchString }} </div>
                <div>Type Selected: {{ typeFilter }} </div>
                <div>Author Selected: {{authorFilter }} </div>
                <div>Sort Selected: {{sortOrder }} </div>
            -->
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
            return this.items.filter(function(item) {
                return this.typeFilter.indexOf(item.type) == -1
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
                'layer',
                'image',
                'image-map',
                'folder',
            ],
            authorFilter: null,
            authorOptions: [
                {value: null, text: 'Filter by Author'},
                {value: 'jamie', text: 'Jamie'},
                {value: 'tim', text: 'Tim'},
                {value: 'austn', text: 'Austin'},
                {value: 'brad', text: 'Brad'},
            ],
            sortOrder: null,
            sortOptions: [
                {value: null, text: 'Sort Preference:'},
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
