<template>
  <div v-if="access('can change site siteadmin')" class="optionsnav" v-bind:class="[sectionClass]">
   
    <b-nav vertical pills class=" ">
        <b-nav-item :active="inSettings" v-if="canBrowse" :to="basePath + '/options/settings'">
            <font-awesome-icon icon="sliders-h"/> 
            <span class="optionsnav-text">Settings</span>
        </b-nav-item> 
        <b-nav-item class="nav-item" :active="inMenus" v-if="canBrowse" :to="basePath + '/options/menus'">
            <font-awesome-icon icon="sitemap"/> 
            <span class="optionsnav-text">Menus</span>
        </b-nav-item>
        <b-nav-item :active="inAppearance" v-if="canBrowse" :to="basePath + '/options/appearance'">
        <font-awesome-icon icon="paint-brush"/> 
        <span class="optionsnav-text">Appearance</span>
        </b-nav-item> 
        <b-nav-item :active="inHomepage" v-if="canBrowse" :to="basePath + '/options/homepage'">
        <font-awesome-icon icon="home"/> 
        <span class="optionsnav-text">Homepage</span>
        </b-nav-item> 
        <b-nav-item :active="inPeople"  :to="basePath + '/options/people'"><font-awesome-icon icon="user-cog"/> 
        <span class="optionsnav-text">People</span>
        </b-nav-item >
        <b-nav-item :active="inGroups"  :to="basePath + '/options/groups'"><font-awesome-icon icon="users"/> 
        <span class="optionsnav-text">Groups</span>
        </b-nav-item >
      </b-nav>  
    </div>   

</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
export default  Vue.extend({
    computed:{
        sectionClass(){
            return this.$route.meta.sectionClass;
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
        inGroups(){
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
    mounted(){
        
    }
});
</script>

<style>

/* needs to be unscoped */

.optionsnav {
 max-width: 20rem;
 margin:auto;
}

.active-section.nav-item {
 order:-1;

}

.options-sectionnav .nav-link {
    text-transform:uppercase;
    color:  #fff;
}

.options-sectionnav .nav-link:first-child {
    padding-left:0;
    padding-right:1.5rem;
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

.optionsnav .nav-pills .nav-link.active {
     /* background-color: #343a40; */
         padding: 0.25rem 1rem .3rem 1rem;
    margin-top: .25rem;
    margin-bottom: .25rem;
    width:13rem;
}


.active-section.nav-item .nav-link,
.active-section.nav-item .nav-link.active   
 {
    background-color: #343a40;
    color: #fff;
    border-color: none;
    padding: 0.25rem 1rem .3rem 1rem;
    margin-top: .25rem;
    margin-bottom: .25rem;

}

.options-sectionnav .nav-link.active {
    /* 
    color: #343a40;

    background-color:none !important; */
    /* font-size: 100%;
    padding:.1rem .5rem; */
    font-weight:bold;
    /* border-bottom: 5px solid #000; */
    padding: 0.25rem 0 0 0;

    margin-bottom: .25rem;
    font-size:105%
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

.optionsnav .nav-link {
 display:flex;
 color:#ddd;
}

.optionsnav .nav-link.active {
 display:flex;
 color:#fff !important;
 font-weight:bold;
 background:none !important;
     font-size:105%
}

.optionsnav .nav-link.active svg {
  background: #fff;

}

.optionsnav .nav-link svg {
  display: flex;
  align-items: center;
  color: #333   ;
  background: #ddd;
  padding: .25rem;
  border-radius: .2rem;
  font-size: 1.5rem;
  width: 1.5rem;
}


</style>
