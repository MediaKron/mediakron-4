<template>
    <b-navbar-nav class="primarynav ml-auto mr-1">
        <b-nav-item v-if="!hasItems && access('can change site settings')" to="/settings/navigation">Add Menus</b-nav-item>
        <b-nav-item v-for="item in items" v-bind:key="item.id" class="text-uppercase menu-item" :to="item.url">Menu {{item.title}}</b-nav-item>
         <b-nav-item v-if="currentSite.search" :to="basePath + '/search'" v-b-tooltip.bottom title="Search">
            <font-awesome-icon icon="search"/> 
            <span class="sr-only">Search</span>
        </b-nav-item>
         <!-- <b-nav-item v-if="currentSite.tags && tags.length > 0" :to="basePath + '/tags'"> Tags</b-nav-item> -->
        <b-nav-item :to="basePath + '/tags'" v-b-tooltip.bottom title="Tags">  
            <font-awesome-icon icon="tags"/> 
            <span class="sr-only">Tags</span>
        </b-nav-item>
    </b-navbar-nav>
</template>

<script>
    import Vue from 'vue';
    import {
        mapGetters, mapState
    } from 'vuex';
    export default Vue.extend({
        computed: {

            hasItems() {
                return this.items.length > 0;
            },
            items() {
                console.log(this.currentSite.primary);
                return this.currentSite.primary;
            },
            ...mapState('sites', [
            'currentSite'
             ]),
            ...mapGetters('sites', [
                'currentSite',
                'siteIsLoaded',
                'basePath'
            ]),
            ...mapGetters('users/profile', [
                'isGuest',
                'isAdmin',
                'access',
            ]),
            ...mapGetters('items', [
            'tags'
        ]),
        }
    });
</script>

<style>

/* .primarynav .nav-item .nav-link {
    display: flex;
    align-items: center;
} */

.primarynav .menu-item:last-child {
    margin-right: 1em;
}

</style>
