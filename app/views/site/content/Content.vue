<template>
<div>
    <b-navbar toggleable="md" type="dark" class="pl-0 pr-0 py-0 z-index-1 w-100" variant="primary" aria-label="site menus" >
        <b-navbar-brand class="text-uppercase site-options-title ml-4"> <font-awesome-icon icon="th-large" class="mr-1"/>  Content</b-navbar-brand>
        <b-navbar-nav class="ml-auto">
            <b-nav-item :to="basePath + '/'" class="admin-close ml-auto mr-2 ">      
                <font-awesome-icon icon="times"/> 
                <span class="utilitynav-text">Close</span>
            </b-nav-item>   
        </b-navbar-nav> 
    </b-navbar>
    <b-container class="mt-5 layout-sidebar-left ">
    <div class="row">
      <!-- <div class="sidebar-left col-md-4" > -->
        <div id="filters">
           <b-form-group id="fieldsetHorizontal"
                         horizontal
                         label-cols="2"
                         breakpoint="md"
                         description=""
                         label=""
                         label-for="searchString">
               <b-form-input v-model="searchString" type="text" placeholder="Search" />
              <!--  <b-form-select v-model="typeFilter" :options="typeOptions" class="mb-3" /> -->

               <multiselect v-model="typeFilter" :options="typeOptions" :multiple="true"></multiselect>
               <b-form-select v-model="authorFilter" :options="authorOptions" class="mb-3" />
               <b-form-select v-model="sortOrder" :options="sortOptions" class="mb-3" />
           </b-form-group>
            <!--
           <div>Searched: {{ searchString }} </div>
           <div>Type Selected: {{ typeFilter }} </div>
           <div>Author Selected: {{authorFilter }} </div>
           <div>Sort Selected: {{sortOrder }} </div>
           -->
        </div>
        <main role="main" class="with-sidebar-left col-md-12" > 
            <header>
                <h1 class="line-behind heading-nudge-up"> Content Browser</h1>
            </header>

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

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
