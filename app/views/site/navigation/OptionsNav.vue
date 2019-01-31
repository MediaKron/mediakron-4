<template>
  <div v-if="access('can change site siteadmin')" class="optionsnav" :class="activesection">
    <b-nav vertical pills class="">
        <b-nav-item :active="inSettings" v-if="canBrowse" :to="basePath + '/options/settings/general'">
            <font-awesome-icon icon="sliders-h"/> 
            <span class="optionsnav-text">Settings</span>
        </b-nav-item> 
        <b-nav-item :class="[ inMenus ? 'active-section' : '' ]" v-if="canBrowse" :to="basePath + '/options/menus'">
            <font-awesome-icon icon="sitemap"/> 
            <span class="optionsnav-text">Menus</span>
        </b-nav-item> 
        <b-nav-item :class="[ inAppearance ? 'active-section' : '' ]" v-if="canBrowse" :to="basePath + '/options/appearance'">
        <font-awesome-icon icon="paint-brush"/> 
        <span class="optionsnav-text">Appearance</span>
        </b-nav-item> 
        <b-nav-item :class="[ inHomepage ? 'active-section' : '' ]" v-if="canBrowse" :to="basePath + '/options/homepage'">
        <font-awesome-icon icon="home"/> 
        <span class="optionsnav-text">Homepage</span>
        </b-nav-item> 
        <b-nav-item :class="[ inPeople ? 'active-section' : '' ]" :to="basePath + '/options/people/list'"><font-awesome-icon icon="user-cog"/> 
        <span class="optionsnav-text">People</span>
        </b-nav-item >
      </b-nav>  
    </div>   

</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
export default  Vue.extend({
    computed:{
        activesection(){
            return 'inactive';
        },
        inSettings(){
            return this.$route.meta.inSettings;
        },
        inMenus(){
            return this.$route.meta.inMenus;
        },
        inAppearance(){
            return this.$route.meta.inAppearance;
        },
        inHomepage(){
            return this.$route.meta.inHomepage;
        },
        inPeople(){
            return this.$route.meta.inPeople;
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
    mounted(){
        
    }
});
</script>

<style>

/* needs to be unscoped */

.optionsnav {
 max-width: 12rem;
 margin:auto;
}

.active-section.nav-item {
 order:-1;

}

.options-sectionnav .nav-link {
    text-transform:uppercase;
    color: #343a40;
}

.options-sectionnav .nav-link.active {
    margin-right: .5rem;
}

.options-sectionnav .nav-link:hover {
    text-decoration:underline;
}

.options-sectionnav .nav-link.active:hover {
    text-decoration:none;
}

.options-sectionnav .nav-link.active,
.active-section.nav-item .nav-link,
.active-section.nav-item .nav-link.active,
  .nav-item.show .nav-link {
    background-color: #343a40;
    color: #fff;
    border-color: none;
    padding: 0.25rem 1rem .3rem 1rem;
    margin-top: .25rem;
    margin-bottom: .25rem;

}

.options-sectionnav .nav-link.active {
    /* padding-left:0;
    color: #343a40;
    font-weight:bold;
    background-color:none !important; */
    font-size: 100%;
    padding:.1rem .5rem;
}

.menus .optionsnav-menus {
 background: red;
}

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
