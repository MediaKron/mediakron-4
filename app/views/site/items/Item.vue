<template>
    <div>
        <Navigation></Navigation>
        <main>
            <component class="mt-8" v-if="itemIsLoaded" :is="component" :item="first" />
        </main>
    </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import Images from './Images'
import Videos from './Videos'
import Folders from './Folders'
import Navigation from '@/views/site/Navigation'
import { circleMarker } from 'leaflet'

export default {
    props:[
        'firstUri', 
        'secondUri', 
        'thirdUri'
    ],
    components: {
        Navigation
    },
    
    mounted(){
        // go fetch the items
        this.itemsRouteLoad({ first: this.firstUri })
    },
    computed: {
        ...mapGetters("items", [
            "itemLoading", 
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
                    return Folders
            }
            
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