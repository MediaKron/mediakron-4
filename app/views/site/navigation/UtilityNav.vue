<template>
    <b-navbar toggleable="md" type="dark" class="pl-0 pr-0 py-0 z-index-1" variant="primary" aria-label="site menus" >
      <b-navbar-toggle target="nav_collapse" class="order-2 border-0" ></b-navbar-toggle>
      <!-- <b-navbar-brand class="text-uppercase">Site Options</b-navbar-brand> -->
      <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav class="utilitynav w-100 ">            
                <!-- <b-nav-item v-if="access('can create content') || access('can archive content') || access('can import')" :to="basePath + '/settings/general/'"> 
                    <font-awesome-icon icon="sliders-h"/> 
                    <span class="utilitynav-text">Settings</span>
                </b-nav-item>   
                <b-nav-item v-if="canBrowse" :to="basePath + '/menus'">
                    <font-awesome-icon icon="sitemap"/> 
                    <span class="utilitynav-text">Menus</span>
                </b-nav-item>
                <b-nav-item v-if="canBrowse" :to="basePath + '/appearance'">
                    <font-awesome-icon icon="paint-brush"/> 
                    <span class="utilitynav-text">Appearance</span>
                </b-nav-item>
                <b-nav-item v-if="canBrowse" :to="basePath + '/homepage'">
                    <font-awesome-icon icon="home"/> 
                    <span class="utilitynav-text">Homepage</span>
                </b-nav-item>
                <b-nav-item v-if="canBrowse" :to="basePath + '/browse'">
                    <font-awesome-icon icon="th-large"/> 
                    <span class="utilitynav-text">Content</span>
                </b-nav-item>
                <b-nav-item v-if="canBrowse && changeCount > 0" :to="basePath + '/updates'"><sup>{{ changeCount }}</sup> Changes
                </b-nav-item>        
                <b-nav-item :to="basePath + '/people'"><font-awesome-icon icon="user-cog"/> 
                    <span class="utilitynav-text">People</span>
                </b-nav-item>
                <b-nav-item :to="basePath + '/help'"> <font-awesome-icon icon="question-circle"/> 
                    <span class="utilitynav-text">Help</span>
                </b-nav-item>
                <b-nav-item href="http://mediakron.bc.edu" id="mklogo" class="d-none"> 
                    <img class="mediakron-logo img-fluid" :src="require('@/assets/images/MKlogo.png')" />
                    <span class="utilitynav-text">MediaKron</span>
                </b-nav-item> -->
                <b-nav-item-dropdown left extra-toggle-classes="manage-button text-uppercase pl-4 bg-dark" extra-menu-classes="manage-dropdown">
            <template slot="button-content">
                <font-awesome-icon icon="ellipsis-v"/> 
                <span class="item-text"> Site Options</span>
            </template>
            <b-dropdown-item v-if="access('can create content') || access('can archive content') || access('can import')" :to="basePath + '/settings/general/'"> 
            <font-awesome-icon icon="sliders-h"/> 
            <span class="utilitynav-text">Settings</span>
            </b-dropdown-item >  
            <b-dropdown-item v-if="canBrowse" :to="basePath + '/menus'">
            <font-awesome-icon icon="sitemap"/> 
            <span class="utilitynav-text">Menus</span>
            </b-dropdown-item> 
            <b-dropdown-item v-if="canBrowse" :to="basePath + '/appearance'">
            <font-awesome-icon icon="paint-brush"/> 
            <span class="utilitynav-text">Appearance</span>
            </b-dropdown-item> 
             <b-dropdown-item v-if="canBrowse" :to="basePath + '/homepage'">
            <font-awesome-icon icon="home"/> 
            <span class="utilitynav-text">Homepage</span>
            </b-dropdown-item> 
            <b-dropdown-item v-if="canBrowse" :to="basePath + '/browse'">
            <font-awesome-icon icon="th-large"/> 
            <span class="utilitynav-text">Content</span>
            </b-dropdown-item >
            <b-dropdown-item v-if="canBrowse && changeCount > 0" :to="basePath + '/updates'"><sup>{{ changeCount }}</sup> Changes
            </b-dropdown-item > 
            <b-dropdown-item :to="basePath + '/people'"><font-awesome-icon icon="user-cog"/> 
            <span class="utilitynav-text">People</span>
            </b-dropdown-item >
            <b-dropdown-item :to="basePath + '/help'"> <font-awesome-icon icon="question-circle"/> 
            <span class="utilitynav-text">Help</span>
            </b-dropdown-item >
        </b-nav-item-dropdown>
                <b-nav-item :to="basePath + '/'" class="admin-close ml-auto mr-2"> 
                    <font-awesome-icon icon="times"/> 
                    <span class="utilitynav-text">Close</span>
                </b-nav-item>   
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>

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

<style>

/* needs to be unscoped */

#mklogo .mediakron-logo {
    height: 1.2em;
    border:1px solid #ccc;
    /* margin-bottom:.3em;
    margin-top:.2em; */
}

.utilitynav .manage-button {
    width: 15rem;
}

.hide-menus .utilitynav .nav-item {
    display:none;
}

.hide-menus .utilitynav .nav-item:last-child {
    display:block;
}

.utilitynav-text {
    text-transform: uppercase;
    padding-left:.5em; 
} 


</style>
