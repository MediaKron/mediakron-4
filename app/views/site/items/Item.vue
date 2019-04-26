<template>
    <div>
         <Navigation class=""></Navigation>
        <main>
            <loader v-if="itemIsLoading" class="flex justify-center mt-8"></loader>
            <component class="mt-12" v-if="itemIsLoaded" :is="component" :item="first" />
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
export default {
    props:[
        'firstUri', 
        'secondUri', 
        'thirdUri'
    ],
    components: {
        Navigation,
        Loader
    },
    
    mounted(){
        // go fetch the items
        this.itemsRouteLoad({ first: this.firstUri, second: this.secondUri, third: this.thirdUri })
    },
    computed: {
        ...mapGetters("items", [
            "itemIsLoading", 
            "itemIsLoaded",
            "first", 
            "second",
            "third",
            "isEditing"
        ]),
        component(){
            switch(this.first.type){
                case 'image':
                    return Images
                case 'video':
                    return Videos
                case 'folder':
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