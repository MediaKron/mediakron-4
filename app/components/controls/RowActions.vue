<template>
    <div>
        <b-button v-if="item.archived && currentUser.canUnarchive(item)">Unarchive</b-button>
        <b-button v-if="item.status">Publish</b-button>
        <b-button v-if="!item.status">Unpublish</b-button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        mapGetters,
        mapActions
    } from 'vuex';
export default {
    props: [
        'item'
    ],
    computed: {
        ...mapGetters('users', [
                'currentUser'
            ]),
    },
}
</script>

<style>

</style>
