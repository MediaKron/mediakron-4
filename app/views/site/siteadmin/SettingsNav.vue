<template>
<div class="siteadminnav sidebar-sticky pt-2">
<div v-if="access('can change site siteadmin')">

<h4 class="sidebar-heading sr-only"><font-awesome-icon icon=""/> Settings</h4>  

<div v-if="access('can change site siteadmin')">
  <b-nav vertical pills>
    <b-nav-item :to="basePath + '/siteadmin/privacy'">Privacy</b-nav-item>
    <b-nav-item :to="basePath + '/siteadmin/comments'">Comments</b-nav-item>
    <b-nav-item :to="basePath + '/siteadmin/appearance'">Appearance</b-nav-item>
    <b-nav-item :to="basePath + '/siteadmin/navigation'">Menus</b-nav-item>
    <b-nav-item :to="basePath + '/siteadmin/homepage'">Homepage</b-nav-item>
    <b-nav-item :to="basePath + '/siteadmin/itemoptions'">Item Options</b-nav-item>
    <b-nav-item :to="basePath + '/siteadmin/statistics'">Usage Statistics</b-nav-item>
    <b-nav-item :to="basePath + '/siteadmin/google analytics'">Google Analytics</b-nav-item>
    <b-nav-item :to="basePath + '/siteadmin/canvas'">Canvas</b-nav-item>
    <b-nav-item :to="basePath + '/siteadmin/performance'">Site Cache</b-nav-item>
    <b-nav-item :to="basePath + '/siteadmin/search'" >Search Index</b-nav-item>
   </b-nav>  
</div>


  

</div>
</div>

</template>

<script>
import {
        mapGetters, mapActions
    } from 'vuex';
export default {
  name: 'Settingsnav',
  computed:{
        ...mapGetters('users/profile', [
            'access'
        ]),
        ...mapGetters('sites', [
            'currentSite',
            'basePath'
        ])
    }
}
</script>

<style scoped>
#mklogo .mediakron-logo {
    height: 20px;
}

.settingsnav a {
  color: #565656;
}

.sidebar-heading {
  font-size:1em;
  margin-top: 1em;
  padding: 0 1em;
}

.nav-link {
  font-size:.9em;
    margin: 0 .5em 0 .5em;
    padding: .25rem 1rem;
}

/*
 * Navbar
 */



</style>
