<template>
    <b-navbar-nav class="secondary-menu ml-auto">
        <b-nav-item v-if="canBrowse" :to="basePath + '/browse'">
            <font-awesome-icon icon="th-large"/> 
            <span class="sr-only"> Browse</span>
        </b-nav-item>
        <b-nav-item v-if="canBrowse && changeCount > 0" :to="basePath + '/updates'"><sup>{{ changeCount }}</sup> Changes</b-nav-item>
        <b-nav-item v-if="currentSite.tags && tags.length > 0" :to="basePath + '/tags'"> Tags</b-nav-item>
        <b-nav-item v-if="currentSite.search" :to="basePath + '/search'">
            <font-awesome-icon icon="search"/> 
            <span class="sr-only"> Search</span>
        </b-nav-item>
        <b-nav-item v-if="access('can create content')" :to="basePath + '/settings/content/add'">
            <font-awesome-icon icon="plus-square"/> 
            <span class="sr-only"> Add</span>
        </b-nav-item>
        <b-nav-item v-if="access('can create content') || access('can archive content') || access('can import')" :to="basePath + '/settings'"> 
            <font-awesome-icon icon="cog"/> 
            <span class="sr-only"> Settings</span>
        </b-nav-item>
        <b-nav-item-dropdown v-if="currentSite.user && isGuest"  text="User" right>
            
            <template slot="button-content">
                <font-awesome-icon icon="user"/> 
                <span class="sr-only"> User</span>
            </template>
           <b-dropdown-item >{{ user.name }} <span class="user-role">Roles: {{ user.role }}</span></b-dropdown-item>
            <b-dropdown-item :to="basePath + '/mycontent'">My Content</b-dropdown-item>
            <b-dropdown-item :to="basePath + '/profile'">My Account</b-dropdown-item>
            <b-dropdown-item :to="basePath + '/settings/users'">Manage Site Users</b-dropdown-item>
            <b-dropdown-item :to="basePath + '/logout'">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
        
        <b-nav-item v-if="isGuest" :to="basePath + '/login'"> 
            <font-awesome-icon icon="sign-in-alt"/> 
            <span class="sr-only"> Login</span>
        </b-nav-item>
        <b-nav-item-dropdown v-if="!isGuest"  text="Help" right>
            <b-nav-item>MediaKron Support</b-nav-item>
            <b-nav-item href="mailto:mediakron@bc.edu">Email mediakron@bc.edu</b-nav-item>
            <b-nav-item href="/help">Visit Support</b-nav-item>
            <b-nav-item-dropdown text="Help Categories" right>
                <b-nav-item :to="basePath + '/help/mediakron-basics'">About MediaKron</b-nav-item>
                <b-nav-item :to="basePath + '/help/working-with-content'">Working with Content</b-nav-item>
                <b-nav-item :to="basePath + '/help/mediakron-basics'">Administering Your Site</b-nav-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="For content creators" right>
                <b-nav-item :to="basePath + '/help/working-with-content/content-types/stories-overview'">Working with stories</b-nav-item>
                <b-nav-item :to="basePath + '/help/working-with-content/content-types/folder-overview'">Working with folders</b-nav-item>
                <b-nav-item :to="basePath + '/help/working-with-content/content-types/map-overview'">Working with maps</b-nav-item>
                <b-nav-item :to="basePath + '/help/working-with-content/content-types/timeline-overview'">Working with timelines</b-nav-item>
                <b-nav-item :to="basePath + '/help/working-with-content/content-types'">Other content types</b-nav-item>
                <b-nav-item :to="basePath + '/help/working-with-content/revisions'">Recovering previous versions</b-nav-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="For Site Administrators" right>
                <b-nav-item :to="basePath + '/help/site-administration/managing-users'">Adding users or classes to a site</b-nav-item>
                <b-nav-item :to="basePath + '/help/site-administration/hompage-overview'">Customizing the homepage</b-nav-item>
                <b-nav-item :to="basePath + '/help/site-administration/menu-overview'">Adding Menus</b-nav-item>
                <b-nav-item :to="basePath + '/help/site-administration/site-appearance'">Changing site colors/logo</b-nav-item>
                <b-nav-item :to="basePath + '/help/site-administration/mediakron-to-canvas-overview'">Integrating MediaKron with Canvas</b-nav-item>
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
    mounted(){
        
    }
});
</script>

<style scoped>
#mklogo .mediakron-logo {
    height: 20px;
}
.fade-enter-active, 
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, 
.fade-leave-to {
  opacity: 0;
}

</style>
