<template>
    <b-navbar-nav right="true" class="secondary-menu">
        <b-nav-item v-if="canBrowse" :to="currentSite.uri + '/browse'">
            <font-awesome-icon icon="list"/> 
            <span class="sr-only"> Browse</span>
        </b-nav-item>
        <b-nav-item v-if="canBrowse && changeCount > 0" :to="currentSite.uri + '/updates'"><sup>{{ changeCount }}</sup> Changes</b-nav-item>
        <b-nav-item v-if="currentSite.tags && tags.length > 0" :to="currentSite.uri + '/tags'"> Tags</b-nav-item>
        <b-nav-item v-if="currentSite.search" :to="currentSite.uri + '/search'">
            <font-awesome-icon icon="search"/> 
            <span class="sr-only"> Search</span>
        </b-nav-item>
        <b-nav-item v-if="access('can create content')" :to="currentSite.uri + '/settings/content/add'">
            <font-awesome-icon icon="plus-square"/> 
            <span class="sr-only"> Add</span>
        </b-nav-item>
        <b-nav-item v-if="access('can create content') || access('can archive content') || access('can import')" :to="currentSite.uri + '/settings'"> 
            <font-awesome-icon icon="cogs"/> 
            <span class="sr-only"> Settings</span>
        </b-nav-item>

        <b-nav-item-dropdown v-if="currentSite.user && isGuest"  text="User" right>
          <template slot="button-content">
            <font-awesome-icon icon="user"/> 
            <span class="sr-only"> User</span>
          </template>
          <b-dropdown-item>User Information</b-dropdown-item>
          <b-dropdown-item >{{ user.name }} <span class="user-role">Role: {{ user.role }}</span></b-dropdown-item>
           <b-nav-item :to="currentSite.uri + '/mycontent'">My Content</b-nav-item>
            <b-nav-item :to="currentSite.uri + '/profile'">My Account</b-nav-item>
             <b-nav-item :to="currentSite.uri + '/settings/users'">Manage Site Users</b-nav-item>
             <b-nav-item :to="currentSite.uri + '/logout'">Sign Out</b-nav-item>
        </b-nav-item-dropdown>
        <b-nav-item v-if="isGuest" :to="currentSite.uri + '/login'"> 
            <font-awesome-icon icon="sign-in-alt"/> 
            <span class="sr-only"> Login</span>
        </b-nav-item>
        <b-nav-item-dropdown v-if="!isGuest"  text="Help" right>
            <b-nav-item>MediaKron Support</b-nav-item>
            <b-nav-item href="mailto:mediakron@bc.edu">Email mediakron@bc.edu</b-nav-item>
            <b-nav-item href="/help">Visit Support</b-nav-item>
            <b-nav-item-dropdown text="Help Categories" right>
                <b-nav-item :to="currentSite.uri + '/help/mediakron-basics'">About MediaKron</b-nav-item>
                <b-nav-item :to="currentSite.uri + '/help/working-with-content'">Working with Content</b-nav-item>
                <b-nav-item :to="currentSite.uri + '/help/mediakron-basics'">Administering Your Site</b-nav-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="For content creators" right>
                <b-nav-item :to="currentSite.uri + '/help/working-with-content/content-types/stories-overview'">Working with stories</b-nav-item>
                <b-nav-item :to="currentSite.uri + '/help/working-with-content/content-types/folder-overview'">Working with folders</b-nav-item>
                <b-nav-item :to="currentSite.uri + '/help/working-with-content/content-types/map-overview'">Working with maps</b-nav-item>
                <b-nav-item :to="currentSite.uri + '/help/working-with-content/content-types/timeline-overview'">Working with timelines</b-nav-item>
                <b-nav-item :to="currentSite.uri + '/help/working-with-content/content-types'">Other content types</b-nav-item>
                <b-nav-item :to="currentSite.uri + '/help/working-with-content/revisions'">Recovering previous versions</b-nav-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="For Site Administrators" right>
                <b-nav-item :to="currentSite.uri + '/help/site-administration/managing-users'">Adding users or classes to a site</b-nav-item>
                <b-nav-item :to="currentSite.uri + '/help/site-administration/hompage-overview'">Customizing the homepage</b-nav-item>
                <b-nav-item :to="currentSite.uri + '/help/site-administration/menu-overview'">Adding Menus</b-nav-item>
                <b-nav-item :to="currentSite.uri + '/help/site-administration/site-appearance'">Changing site colors/logo</b-nav-item>
                <b-nav-item :to="currentSite.uri + '/help/site-administration/mediakron-to-canvas-overview'">Integrating MediaKron with Canvas</b-nav-item>
            </b-nav-item-dropdown>
        </b-nav-item-dropdown>
        <b-nav-item> 
            <font-awesome-icon icon="expand-arrows-alt"/> 
            <span class="sr-only"> Fullscreen</span>
        </b-nav-item>
        <b-nav-item href="http://mediakron.bc.edu" id="mklogo"> <img class="mediakron-logo img-fluid" :src="require('@/assets/images/MKlogo.png')" /></b-nav-item>
    </b-navbar-nav>
</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
export default  Vue.extend({
    computed:{
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
            'siteIsLoaded'
        ]),
        ...mapState('items', [
            'changed',
            'changeCount'
        ]),
        ...mapGetters('items', [
            'tags'
        ]),
    },
    mounted(){
        
    }
});
</script>

<style lang="sass">
.secondary-menu
    float: right
    .mediakron-logo
        height: 20px
</style>
