<template>
  <div v-if="access('can change site siteadmin')">
    <b-nav pills vertical class="pb-2 px-3 ">
        <b-nav-item v-if="canBrowse" :to="basePath + '/options/settings/general'">
        <font-awesome-icon icon="sliders-h"/> 
        <span class="optionsnav-text">Settings</span>
        </b-nav-item> 
        <b-nav-item v-if="canBrowse" :to="basePath + '/options/menus'">
        <font-awesome-icon icon="sitemap"/> 
        <span class="optionsnav-text">Menus</span>
        </b-nav-item> 
        <b-nav-item v-if="canBrowse" :to="basePath + '/options/appearance'">
        <font-awesome-icon icon="paint-brush"/> 
        <span class="optionsnav-text">Appearance</span>
        </b-nav-item> 
        <b-nav-item v-if="canBrowse" :to="basePath + '/options/homepage'">
        <font-awesome-icon icon="home"/> 
        <span class="optionsnav-text">Homepage</span>
        </b-nav-item> 
        <b-nav-item v-if="canBrowse && changeCount > 0" :to="basePath + '/updates'"><sup>{{ changeCount }}</sup> Changes
        </b-nav-item > 
        <b-nav-item :to="basePath + '/options/people'"><font-awesome-icon icon="user-cog"/> 
        <span class="optionsnav-text">People</span>
        </b-nav-item >
        <b-nav-item :to="basePath + '/help'"> <font-awesome-icon icon="question-circle"/> 
        <span class="optionsnav-text">Help</span>
        </b-nav-item >
      </b-nav>  
    </div>   

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


.optionsnav .manage-button {
    width: 15rem;
}

.hide-menus .optionsnav .nav-item {
    display:none;
}

.optionsnav-text {
    text-transform: uppercase;
    padding-left:.5em; 
} 

.dropdown-menu.expanded.show {
    position:relative !important;
    top:auto !important;
    display:block !important;  
    transform: translate3d(0px, 10px, 0px) !important;
    border:none;
    padding-top:0;
    margin-top:0;   
    background:none;
    margin-left:1rem;
}


</style>
