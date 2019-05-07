<template>
    <b-navbar-nav class="secondarynav ml-3">
        
        <!-- <b-nav-item v-if="canBrowse" :to="basePath + '/content'" class="bg-dark">
            <font-awesome-icon icon="th-large"/> 
            <span class="item-text">Content</span>
        </b-nav-item> -->

          <b-nav-item-dropdown no-caret right v-if="currentSite.user && isGuest" extra-toggle-classes="text-uppercase bg-dark" extra-menu-classes="content-dropdown" >
            <template slot="button-content" >
                <font-awesome-icon icon="th-large"/> 
                <span class="item-text">Content</span>
            </template>
            <b-dropdown-item :to="basePath + '/content/mycontent'">My Content</b-dropdown-item>
            <b-dropdown-item :to="basePath + '/content/all'"> Site Library</b-dropdown-item>
            <b-dropdown-item :to="basePath + '/content/authors'">Authors</b-dropdown-item>
        </b-nav-item-dropdown>

         <!-- <b-nav-item class="bg-dark" :to="basePath + '/profile'"> 
        <font-awesome-icon icon="user"/> 
        <span class="item-text">Profile</span>
        </b-nav-item > -->

         <li class="bg-dark nav-item"> 
            <b-dropdown variant="link" no-caret right toggle-class="nav-link border-0">
                <template slot="button-content">
                    <font-awesome-icon icon="user"/><span class="item-text">Profile</span>
                </template>
                <b-dropdown-text>Logged in as: {{ user.name }}</b-dropdown-text>
                <b-dropdown-text>My Role: {{ user.role }}</b-dropdown-text>
                <b-dropdown-item :to="basePath + '/logout'">Sign Out</b-dropdown-item>
            </b-dropdown>

        </li>

        <!-- <b-nav-item-dropdown no-caret right v-if="currentSite.user && isGuest" extra-toggle-classes="text-uppercase bg-dark px-3" extra-menu-classes="users-dropdown" >
            <template slot="button-content" >
                <font-awesome-icon icon="user"/> 
                <span class="item-text">Profile</span>
            </template>

            <b-dropdown-item :to="basePath + '/mycontent'">My Content</b-dropdown-item>
            <b-dropdown-item :to="basePath + '/profile'">Profile</b-dropdown-item>
            <b-dropdown-item :to="basePath + '/logout'">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown> -->

        <b-nav-item class="bg-dark" :to="basePath + '/help'"> 
        <font-awesome-icon icon="question-circle"/> 
        <span class="item-text">Help</span>
        </b-nav-item >

         <!-- <b-nav-item v-if="isGuest" :to="basePath + '/options'" class="manage-button text-uppercase bg-dark"> 
            <font-awesome-icon icon="cog"/> 
            <span class="item-text">Options</span>
        </b-nav-item> -->


        <b-nav-item-dropdown right no-caret extra-toggle-classes="manage-button text-uppercase bg-dark" extra-menu-classes="manage-dropdown">
            <template slot="button-content">
                <font-awesome-icon icon="cog"/> 
                <span class="item-text">Settings</span>
            </template>
            <b-dropdown-item v-if="access('can create content') || access('can archive content') || access('can import')" :to="basePath + '/settings/general'"> 
                <font-awesome-icon icon="sliders-h"/> 
                <span class="utilitynav-text"> General</span>
            </b-dropdown-item >  
            <b-dropdown-item v-if="canBrowse" :to="basePath + '/settings/menus'">
                <font-awesome-icon icon="sitemap"/> 
                <span class="utilitynav-text"> Menus</span>
            </b-dropdown-item> 
            <b-dropdown-item v-if="canBrowse" :to="basePath + '/settings/appearance'">
                <font-awesome-icon icon="paint-brush"/> 
                <span class="utilitynav-text"> Appearance</span>
            </b-dropdown-item> 
            <b-dropdown-item :to="basePath + '/settings/people'"><font-awesome-icon icon="user-cog"/> 
            <span class="utilitynav-text"> People</span>
            </b-dropdown-item>
            <b-dropdown-item :to="basePath + '/settings/groups'"><font-awesome-icon icon="users"/> 
                <span class="utilitynav-text"> Groups</span>
                </b-dropdown-item >
        </b-nav-item-dropdown>

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
            'currentSite',
            'basePath'
        ]),
        ...mapState('items', [
            'changed',
            'changeCount'
        ]),
    },
    mounted(){
        
    }
});
</script>

<style>
.secondarynav .nav-item {
    /* padding-top:.3em;
    padding-bottom:.3em; */
    text-align:center;
}

.secondarynav .nav-item .nav-link {
    padding-top:.3em;
    padding-bottom: .4em;
}

/* .secondarynav .nav-item:first-child .nav-link {
    border-left: 1px solid #ccc;
    padding-left:1rem !important;
} */

.secondarynav .nav-item:last-child .nav-link {
    padding-right:1rem !important;
}

.secondarynav .item-text {
    text-transform: uppercase;
    font-size: .5em;
    display:block;
    padding-left: .5em;
}

.secondarynav .nav-item .manage-button.nav-link{
    /* border-left: 1px solid #ccc; */
    /* margin-left:1em;  */
    /* padding-left: 1em; */
    display:block;
  }

.secondarynav .dropdown-item {
  /* color:#fff; */
}

.secondarynav .dropdown-menu.users-dropdown {
    min-width:13rem;
}

.secondarynav .dropdown-menu.users-dropdown span {
     /* color:#fff; */
     display:inline-block;
     font-weight:bold;
}

.secondarynav .dropdown-menu {
    top:85%;
    right:5px;
    box-shadow: 0 3px 12px rgba(27,31,35,.15);
}

</style>
