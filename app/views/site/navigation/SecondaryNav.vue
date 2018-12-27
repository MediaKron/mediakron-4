<template>
    <b-navbar-nav class="secondarynav ml-3">
         <b-nav-item v-if="currentSite.search" :to="basePath + '/search'">
            <font-awesome-icon icon="search"/> 
            <span class="sr-only"> Search</span>
        </b-nav-item>
        <b-nav-item v-if="currentSite.tags && tags.length > 0" :to="basePath + '/tags'"> Tags</b-nav-item>
        <b-nav-item-dropdown v-if="currentSite.user && isGuest"  text="User" right>
            
            <template slot="button-content">
                <font-awesome-icon icon="user"/> 
                <span> {{ user.name }}</span>
            </template>
           <b-dropdown-item > <span class="user-role">Role: {{ user.role }}</span></b-dropdown-item>
            <b-dropdown-item :to="basePath + '/mycontent'">My Content</b-dropdown-item>
            <b-dropdown-item :to="basePath + '/profile'">Profile</b-dropdown-item>
            <b-dropdown-item :to="basePath + '/logout'">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
        
        <b-nav-item v-if="isGuest" :to="basePath + '/login'" class="d-none"> 
            <font-awesome-icon icon="sign-in-alt"/> 
            <span class="sr-only"> Login</span>
        </b-nav-item>
       
       
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

.nav-pills .nav-link.active {
    background: #444444;
}

</style>
