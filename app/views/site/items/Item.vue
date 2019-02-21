<template>
    <div>
        <Navigation></Navigation>
         <div class="pin-r fixed mr-3 mt-8">
            <b-button class=" " variant="primary" @click="editClicked"> {{ getEditPrompt }}</b-button>        
        </div>
        <component class="mt-8" v-if="itemIsLoaded" :is="component" :item="first" :isEditing="isEditing"/>
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
        'firstUri', 'secondUri', 'thirdUri'
    ],
    components: {
        Navigation
    },
    data() {
        return {
            isEditing: false,
        }
    },
    mounted(){
        // go fetch the items
        this.itemsRouteLoad({ first: this.firstUri })
    },
    computed: {
        ...mapGetters("items", [
            "itemLoading", 
            "itemIsLoaded",
            "first", "second", "third"
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
        getEditPrompt() {
            if (this.isEditing) return 'Save'
            return 'Edit'
        },
    },
    methods: {
        editClicked() {
            this.isEditing = !this.isEditing
            // Save only if isEditing switched back to false
            if (!this.isEditing) {
                this.saveItem()
            }
        },
        ...mapActions("items", [
            "itemsRouteLoad",
            "update",
            "saveItem"
        ]),
    }

}
</script>

<style>

</style>