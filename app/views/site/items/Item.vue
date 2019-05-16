<template>
    <div>
         <Navigation class=""></Navigation>
        <main>
            <loader v-if="itemIsLoading" class="flex justify-center mt-8"></loader>
            <div class="w-full mx-auto px-6 mt-16 ">
                <div class="flex">
                    <aside v-if="!isEditing" id="sidebar" class="hidden min-w-64 max-w-xs lg:block pb-12">
                        <div class="lg:relative lg:sticky top-20  mr-10 ">
                            <m-collection-sidebar v-if="parentType && parentType != 'map'" class="sticky?lg:h-(screen-32) overflow-y-auto pr-4"></m-collection-sidebar>
                            <!-- <m-map-sidebar v-if="parentType && parentType == 'map'" class="sticky?lg:h-(screen-32) overflow-y-auto pr-4"></m-map-sidebar> -->
                        </div>
                    </aside>
                    <component class="w-full" v-if="itemIsLoaded" :is="component" :item="current" />
                   <div v-if="parentType && parentType == 'collection' && !isEditing" class="fixed flex bottom-0 left-0 bg-white w-full justify-center px-4 py-2">
                       <previous class="mr-4"></previous>
                       <b-link class="text-lg"> Title of current folder </b-link>
                       <next class="ml-4"></next>
                    </div> 
                </div>
            </div>
        </main>
    </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import Images from './Images'
import Videos from './Videos'
import Collections from './Collections'
import Files from './Files'
import Audio from './Audio'
import Timelines from './Timelines'
import Maps from './Maps'
import Navigation from '@/views/site/Navigation'
import { circleMarker } from 'leaflet'
import Loader from '@/components/Loader';
import Next from '@/components/collections/Next';
import Previous from '@/components/collections/Previous';

import MCollectionSidebar from '@/components/collections/CollectionSidebar'
export default {
    props:[
        'firstUri', 
        'secondUri', 
        'thirdUri'
    ],
    components: {
        Navigation,
        Loader,
        MCollectionSidebar, 
        Next,
        Previous
    },
    
    mounted(){
        // go fetch the items
        this.itemsRouteLoad({ first: this.firstUri, second: this.secondUri, third: this.thirdUri })
    },
    computed: {
        ...mapGetters("items", [
            "itemIsLoading", 
            "itemIsLoaded",
            "current",
            "parent", 
            "grandparent",
            "parentType",
            "isEditing"
        ]),
        component(){
            switch(this.current.type){
                case 'image':
                    return Images
                case 'video':
                    return Videos
                case 'collection':
                    return Collections
                case 'file':
                    return Files
                case 'audio':
                    return Audio
                case 'timeline':
                    return Timelines
                case 'map':
                    return Maps
            }
            
        },
        sitenav() {
             return this.$route.meta.siteNav;
            },
        
    },
    watch: {
        '$route.params.first': function (page) {
            this.itemsRouteLoad({ first: this.firstUri, second: this.secondUri, third: this.thirdUri });
        },
        '$route.params.second': function (page) {
            this.itemsRouteLoad({ first: this.firstUri, second: this.secondUri, third: this.thirdUri });
        },
        '$route.params.third': function (page) {
            this.itemsRouteLoad({ first: this.firstUri, second: this.secondUri, third: this.thirdUri });
        },
        '$route.query': function (page) {
            this.itemsRouteLoad({ first: this.firstUri, second: this.secondUri, third: this.thirdUri });
        }
    },
    methods: {
        ...mapActions("items", [
            "itemsRouteLoad",
            "update",
            "saveItem",
            "setEditItem"
        ]),
    }
}
</script>

<style>

</style>