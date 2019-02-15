<template>
    <div>
        <ContentLayout></ContentLayout>
        <component v-if="itemIsLoaded" :is="component" :item="first" />
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
            
        }
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
