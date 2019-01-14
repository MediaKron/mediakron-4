<template>
    <b-navbar toggleable="md" type="dark" class="pl-0 pr-0 py-0 z-index-1 w-100" variant="primary" aria-label="site menus" >
    <b-navbar-brand class="text-uppercase site-options-title ml-4"> <font-awesome-icon icon="cog" class="mr-1"/>  Site Options</b-navbar-brand>
     <b-navbar-nav class="ml-auto">
        <b-nav-item :to="basePath + '/'" class="admin-close ml-auto mr-2 "> 
            <font-awesome-icon icon="times"/> 
            <span class="utilitynav-text">Close</span>
        </b-nav-item>   
    </b-navbar-nav> 
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
/* 
.site-options-title {
    width:15rem;
    text-align:center;
} */


</style>
