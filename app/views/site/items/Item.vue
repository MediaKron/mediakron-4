<template>
    <div>
    <div>Mediakron Site Item</div>
    {{ getState.currentItem }}
    </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';

export default ({
    created(){
        // go fetch the items
        console.log(this.getItem(this.$route.params.id))
        console.log(this.item)

    },
    computed: {
        ...mapGetters("items", ["currentItem", "itemIsLoaded", "itemIsLoading", "getState"]),
    },
    methods: {
        ...mapActions("items", ["getItem"]),
    }
});
</script>

<style>

</style>
