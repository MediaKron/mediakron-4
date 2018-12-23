<template>
<div class="settingsnav sidebar-sticky">
<div v-if="access('can change site settings')">

<h4 class="sr-only">Settings Menu</h4>

<h4 class="sidebar-heading"><font-awesome-icon icon=""/> General Settings</h4>  

  <b-nav vertical pills>
    <b-nav-item :to="basePath + '/settings/general'">Site Title and Info</b-nav-item>
    <b-nav-item :to="basePath + '/settings/privacy'">Privacy</b-nav-item>
    <b-nav-item :to="basePath + '/settings/comments'">Comment Settings</b-nav-item>
  </b-nav>

<h4 class="sidebar-heading"><font-awesome-icon icon=""/> Appearance</h4>  

  <b-nav vertical pills>
    <b-nav-item :to="basePath + '/settings/appearance'">Color Scheme and Font</b-nav-item>
    <b-nav-item :to="basePath + '/settings/navigation'">Menus</b-nav-item>
    <b-nav-item :to="basePath + '/settings/homepage'">Homepage Options</b-nav-item>
    <b-nav-item :to="basePath + '/settings/itemoptions'">Item Options</b-nav-item>
  </b-nav>

  <h4 class="sidebar-heading"><font-awesome-icon icon="User"/> Users</h4>  

  <b-nav vertical pills>
    <b-nav-item :to="basePath + '/settings/users'">Manage Users</b-nav-item>
    <b-nav-item :to="basePath + '/settings/statistics'">Usage Statistics</b-nav-item>
    <b-nav-item :to="basePath + '/settings/google analytics'">Google Analytics</b-nav-item>
   </b-nav>

</div>

<div v-if="access('can archive content') || access('can import') ">
  <h4 class="sidebar-heading"><font-awesome-icon icon="User"/> Content</h4>  
    <b-nav vertical pills>
      <b-nav-item :to="basePath + '/browse'">All Content</b-nav-item>
      <b-nav-item :to="basePath + '/browse/import'">Import</b-nav-item>
      <b-nav-item :to="basePath + '/browse/export'">Export</b-nav-item>
      <b-nav-item v-if="access('can restore from trash')" :to="basePath + '/browse/trash'">Deleted Content</b-nav-item>
      <b-nav-item v-if="access('can archive content')" :to="basePath + '/browse/trash'">Archived Content</b-nav-item>
    </b-nav>  
</div>

<div v-if="access('can change site settings')">
  <h4 class="sidebar-heading"><font-awesome-icon icon=""/> Tools</h4> 
    <b-nav vertical pills>
      <b-nav-item :to="basePath + '/settings/canvas'">Canvas</b-nav-item>
      <b-nav-item :to="basePath + '/settings/performance'">Site Cache</b-nav-item>
      <b-nav-item :to="basePath + '/settings/search'" >Search Index</b-nav-item>
    </b-nav>  

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
