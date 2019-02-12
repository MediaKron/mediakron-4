<template>
    <div>
    <div>Mediakron Site Item</div>
{{ currentItem }}
    </div>
</template>

<script>

import Vue from 'vue';
import { mapGetters, mapState, mapActions } from 'vuex';

export default ({
    created(){
        // go fetch the items
    item: this.getItem(this.$route.params.id)
        console.log(item)

    },
    computed: {
        ...mapGetters("items", ["currentItem"]),
    },
    methods: {
        ...mapActions("items", ["getItem"]),
    },

    data() {
        return {
            props: 'item', // Use this to get the item dets
        }
    }
});
</script>

<style>

</style>
