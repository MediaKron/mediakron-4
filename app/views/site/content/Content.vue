<template>
<div>
    
    <b-container class="mt-12 layout-sidebar-left ">

    <div class="row">
    
        <main role="main" class="col-md-12" > 
            <header>
                <h1 class="sr-only"> Content</h1>
            </header>

            <b-alert show variant="warning">[Tim]: Working on an initial dashboard view before people hit the fill list of items. </b-alert>


            <b-nav pills class="">
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
