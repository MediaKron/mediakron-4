<template>
    <div>
        <ContentLayout></ContentLayout>
         <div>
            <b-button class="float-right" @click="isEditing = !isEditing">{{ getEditPrompt }}</b-button>
        </div>
        <component v-if="itemIsLoaded" :is="component" :item="first" :isEditing="isEditing"/>
    </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import Images from './Images';
import Videos from './Videos';
import ContentLayout from '@/views/site/content/ContentLayout';
export default ({
    props:[
        'firstUri', 'secondUri', 'thirdUri'
    ],
    components: {
        ContentLayout,
    },
    data() {
        return {
            isEditing: false
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
                    return Images;
                case 'video':
                    return Videos;
            }
            
        },
        getEditPrompt() {
            if (this.isEditing) return 'Save'
            return 'Edit'
        },
    },
    methods: {
        ...mapActions("items", [
            "itemsRouteLoad"
        ]),
    }

});
</script>

<style>

</style>
