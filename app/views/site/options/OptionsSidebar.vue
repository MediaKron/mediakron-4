<template>
    <div v-if="access('can change site siteadmin')">
        <b-nav vertical pills>
            <b-nav-item :active="inSettings" v-if="canBrowse" :to="basePath + '/options/settings'">
                <font-awesome-icon icon="sliders-h" />
                <span class="pl-2 uppercase">Settings</span>
            </b-nav-item>
            <b-nav-item class="nav-item" :active="inMenus" v-if="canBrowse" :to="basePath + '/options/menus'">
                <font-awesome-icon icon="sitemap" />
                <span class="pl-2 uppercase">Menus</span>
            </b-nav-item>
            <b-nav-item :active="inAppearance" v-if="canBrowse" :to="basePath + '/options/appearance'">
                <font-awesome-icon icon="paint-brush" />
                <span class="pl-2 uppercase">Appearance</span>
            </b-nav-item>
            <b-nav-item :active="inPeople" :to="basePath + '/options/people'">
                <font-awesome-icon icon="user-cog" />
                <span class="pl-2 uppercase">People</span>
            </b-nav-item>
            <b-nav-item :active="inGroups" :to="basePath + '/options/groups'">
                <font-awesome-icon icon="users" />
                <span class="pl-2 uppercase">Groups</span>
            </b-nav-item>
        </b-nav>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        mapState,
        mapGetters
    } from 'vuex';
    export default Vue.extend({
        computed: {
            sectionClass() {
                return this.$route.meta.sectionClass;
            },
            inSettings() {
                return this.$route.meta.inSettings;
            },
            inMenus() {
                return this.$route.meta.inMenus;
            },
            inAppearance() {
                return this.$route.meta.inAppearance;
            },
            inHomepage() {
                return this.$route.meta.inHomepage;
            },
            inPeople() {
                return this.$route.meta.inPeople;
            },
            inGroups() {
                return this.$route.meta.inGroups;
            },
            ...mapGetters('users/profile', [
                'user',
                'isGuest',
                'isAdmin',
                'isMember',
                'canBrowse',
                'access'
            ]),
            ...mapState('sites', [
                'currentSite'
            ]),
            ...mapGetters('sites', [
                'siteIsLoading',
                'siteIsLoaded',
                'basePath'
            ]),
            ...mapState('items', [
                'changed',
                'changeCount'
            ]),
            ...mapGetters('items', [
                'tags'
            ]),
        },
        mounted() {

        }
    });
</script>

<style>
  
</style>