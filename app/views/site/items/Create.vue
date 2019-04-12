<template>
    <div>
        <main>
            <loader v-if="itemIsLoading"></loader>
            <component class="mt-1" v-if="itemIsLoaded" :is="component" :item="first" />
        </main>
    </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import Images from './Images'
import Videos from './Videos'
import Folders from './Folders'
import Files from './Files'
import Audio from './Audio'
import Timelines from './Timelines'
import Maps from './Maps'
import Navigation from '@/views/site/Navigation'
import { circleMarker } from 'leaflet'
import Loader from '@/components/Loader';
export default {
    props:[
        'type',
    ],
    components: {
        Navigation,
        Loader
    },
    
    mounted(){
        // go fetch the items
        this.createItem(this.type)
    },
    computed: {
        ...mapGetters("items", [
            "itemIsLoading", 
            "itemIsLoaded",
            "first", 
            "isEditing",
            "isCreating"
        ]),
        component(){
            switch(this.first.type){
                case 'image':
                    return Images
                case 'video':
                    return Videos
                case 'folder':
                    return Folders
                case 'file':
                    return Files
                case 'audio':
                    return Audio
                case 'timeline':
                    return Timelines
            }
            
        },
        
    },
    methods: {
        ...mapActions("items", [
            "createItem"
        ]),
    }
}
</script>

<style>

</style>