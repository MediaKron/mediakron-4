<template>
<div class="siteadminnav sidebar-sticky">
  <div v-if="access('can change site siteadmin')">

  <b-link class="btn btn-sm btn-dark" :to="basePath + '/'">Back to Site</b-link>
  <h4 class="sidebar-heading"><font-awesome-icon icon=""/> Users</h4>  

    <b-nav vertical pills>
      <b-nav-item :to="basePath + '/users/general'">List</b-nav-item>
      <b-nav-item :to="basePath + '/users/add'">Add People</b-nav-item>
      <b-nav-item :to="basePath + '/users/groups'">Groups</b-nav-item>
    </b-nav>  
  </div>

</div>

</template>

<script>
import {
        mapGetters, mapActions
    } from 'vuex';
export default {
  name: 'PeopleNav',
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
