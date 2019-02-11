<template>
    <div>
    <div>Mediakron Site Item</div>
        {{ currentItem }}
    </div>
</template>

<script>

import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
/* import ItemCard from "./ItemCard"; */

export default Vue.extend({
    props:[ 
        'id'
    ],
    components: {
    /* ItemCard */
    },

    created(){
        // go fetch the items
    var item = this.getItem(this.$route.params.id)
        console.log(this.item)

    },
    computed: {
        ...mapGetters("items", ["currentItem"]),
    },
    methods: {
        ...mapActions("items", ["getItem"]),
    },

});
</script>

<style>

</style>
