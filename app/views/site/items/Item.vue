<template>
    <div>
        <div>Mediakron Site Item</div>
        <component :is="component" :item="first" />
    </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import Images from './Images';
import Videos from './Videos';
export default ({
    props:[
        'firstUri', 'secondUri', 'thirdUri'
    ],
    mounted(){
        // go fetch the items
        this.itemsRouteLoad({ first: this.firstUri })
    },
    computed: {
        ...mapGetters("items", [
            "itemLoading", 
            "itemLoaded",
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
