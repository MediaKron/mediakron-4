<template>
<div>
    <div class="w-full">
        <div class="flex">
            <Sidebar>
                <h2 class="bg-dark text-white mt-3 mr-12 mb-3 ml-3 pb-2 text-lg uppercase">
                    <font-awesome-icon icon="th-large" /> Content
                </h2>
                <b-nav pills vertical class="sticky?lg:h-(screen-32) overflow-y-auto ">
                    <b-nav-item class="text-xl" :to="basePath + '/content/mycontent'">
                        <span class="optionsnav-text">My Content</span>
                    </b-nav-item>
                    <b-nav-item class="text-xl" :to="basePath + '/content/all'">
                        <span class="optionsnav-text">Site Library</span>
                    </b-nav-item>
                    <b-nav-item class="text-xl" :to="basePath + '/content/authors'">
                        <span class="optionsnav-text">Authors</span>
                    </b-nav-item>
                    <b-button class="mt-4 mx-2" variant="primary" :to="basePath + '/content/add'">
                        <font-awesome-icon icon="plus-square" />
                        <span class="optionsnav-text">Add Content</span>
                    </b-button>
                 </b-nav>
                <b-button variant="link" :to="basePath + '/'"
                    class="bg-white text-black fixed top-0 right-0 ml-auto uppercase flex flex-column content-center justify-center rounded-none mt-3 mr-3">
                    <font-awesome-icon icon="times" class="w-auto text-2xl" />
                    <span class="text-xs"> Close</span>
                </b-button>
            </Sidebar>
            <main role="main" id="content-wrapper"
                class=" min-h-screen w-full mx-auto lg:static lg:max-h-full lg:overflow-visible px-6 mt-16   ">
                <router-view></router-view>
            </main>
        </div>
    </div>
</div>

</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import ContentCard from "./ContentCard";
import Sidebar from "@/components/Sidebar";
import Multiselect from 'vue-multiselect'
export default  Vue.extend({
     components: {
        Multiselect,
        Sidebar,
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
