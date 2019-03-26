<template>
<div>
    <div class="w-full mx-auto px-6">
        <div class="flex">
            <aside id="sidebar" class="hidden min-w-64 max-w-xs lg:block pb-12">
                <div class="lg:relative lg:sticky top-0 border-t-0 border-l-0 border-b-0 border-r-2 border-grey border-solid mr-10 pt-16 ">
                    <div class="sticky?lg:h-(screen-8) overflow-y-auto pr-4">
                     <b-nav pills vertical>
                        <b-nav-item class="text-xl" :to="basePath + '/content/mycontent'">
                            <span class="optionsnav-text">My Content</span>
                        </b-nav-item> 
                        <b-nav-item class="text-xl" :to="basePath + '/content/all'">
                            <span class="optionsnav-text">Site Library</span>
                        </b-nav-item> 
                        <b-nav-item class="text-xl" :to="basePath + '/content/authors'">
                            <span class="optionsnav-text">Authors</span>
                        </b-nav-item> 
                        <b-button class="mt-10 mx-2" variant="primary" :to="basePath + '/content/add'"><font-awesome-icon icon="plus-square"/> 
                            <span class="optionsnav-text">Add Content</span>
                        </b-button>
                        <b-button class="mt-2 mx-2" variant="outline-primary" :to="basePath + '/content/deleted'" ><font-awesome-icon icon="trash-alt"/> 
                            <span class="optionsnav-text">Restore Deleted</span>
                        </b-button>   
                        <b-dropdown class="mt-2 mx-2" variant="outline-primary">
                            <template slot="button-content" >
                               <font-awesome-icon icon="cogs"/> <span class="optionsnav-text">Actions</span>
                            </template>
                            <b-dropdown-item href="#">Delete</b-dropdown-item>
                            <b-dropdown-item href="#">Publish</b-dropdown-item>
                            <b-dropdown-item href="#">Unpublish</b-dropdown-item>
                        </b-dropdown>   
                     </b-nav>
                </div>
                </div>
            </aside>
            <main class="min-h-screen w-full lg:static lg:max-h-full max-w-4xl mx-auto lg:overflow-visible "> 
                <header class="line-behind mt-20 mb-4">
                <h1> Site Library</h1>
                  </header>

            <b-input-group class="mb-3">
                <b-form-input v-model="filter" placeholder="Type to Search" />
                <b-input-group-append>
                    <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                </b-input-group-append>
            </b-input-group>

            <loader v-if="listIsLoading">Loading...</loader>
           <b-table v-if="listIsLoaded" :items="items" :busy="isBusy" :fields="fields" :filter="filter" @filtered="onFiltered" sortBy="updated_at" sort-desc="true" stacked="md">
                <template slot="title" slot-scope="items">
                    <b-img v-bind="placeholderImage" blank-color="#777" alt="Placeholder Image" /> <router-link :to="items.item.url()" class="font-bold text-1xl">{{ items.item.title }}</router-link> 
                </template>
                <template slot="type" slot-scope="items">
                    {{ items.item.type}} 
                </template>
            </b-table>

            <!-- b-pagination-nav :link-gen="linkGen" :number-of-pages="lastPage" use-router / -->
            </main>
         </div>
    </div>
    
           
        
</div>

</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import Loader from '@/components/Loader';
export default  Vue.extend({
     components: {
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
    },
    methods:{
        linkGen (pageNum) {
            return '/' + this.currentSite.url + '/content/alltable/' + pageNum
        },
        ...mapActions('items',[
            'routeLoad'
        ]),
    },
    data() {
        return {
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
            placeholderImage: { blank: true, width: 50, height: 50, class: 'mr-2' },
            isBusy: false,
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

<style>

</style>
