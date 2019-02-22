<template>
    <div>
        <Navigation></Navigation>
        <main>
            <div class="pin-r fixed mr-3 mt-8">
                <b-button class=" " variant="primary" @click="editClicked"> {{ getEditPrompt }}</b-button>       
             <b-alert class="pin-r fixed mt-4 mr-3" :show="editAlert" variant="success">
                <p>You are now in editing mode.</p>
            </b-alert> 
             <b-alert class="pin-r fixed mt-4 mr-3" :show="saveAlert" variant="success">
                <p>Changes Saved.</p>
            </b-alert> 
            </div>

            <component class="mt-8" v-if="itemIsLoaded" :is="component" :item="first" :isEditing="isEditing"/>
            
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
        'firstUri', 'secondUri', 'thirdUri'
    ],
    components: {
        Navigation
    },
    data() {
        return {
            isEditing: false,
            dismissSecs: 4,
            editAlert: 0,
            saveAlert: 0,
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
            this.editAlert = this.dismissSecs 
            
            // Save only if isEditing switched back to false
            if (!this.isEditing) {
                this.saveItem()
                this.saveAlert = this.dismissSecs
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