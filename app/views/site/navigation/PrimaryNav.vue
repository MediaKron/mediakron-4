<template>
    <b-navbar-nav class="primarynav ml-auto mr-2">
        <b-nav-item v-if="!hasItems && access('can change site settings')" to="/settings/navigation">Add Menus</b-nav-item>
        <b-nav-item v-for="item in items" v-bind:key="item.id" class="text-uppercase" :to="item.url">Menu {{item.id}}</b-nav-item>
    </b-navbar-nav>
</template>

<script>
    import Vue from 'vue';
    import {
        mapGetters
    } from 'vuex';
    export default Vue.extend({
        computed: {
            hasItems() {
                return this.items.length > 0;
            },
            items() {
                return this.currentSite.primary;
            },
            ...mapGetters('sites', [
                'currentSite',
                'siteIsLoaded'
            ]),
            ...mapGetters('users/profile', [
                'isGuest',
                'isAdmin',
                'access'
            ])
        }
    });
</script>

<style>
    
</style>
