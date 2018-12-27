<template>
  <header id="header" role="banner">
    <b-navbar toggleable="md" type="dark" class="site-nav px-2 py-0 utilitynav-gap" fixed="top" variant="primary" aria-label="site menus" >
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand :to="'/' + currentSite.uri" class="text-uppercase">{{ currentSite.title }}</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
          <primarynav v-if="currentSite && siteIsLoaded"></primarynav>
          <secondarynav v-if="currentSite && siteIsLoaded"></secondarynav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
import Primarynav from "./navigation/PrimaryNav";
import Secondarynav from "./navigation/SecondaryNav";

export default Vue.extend({
  components: {
    Primarynav,
    Secondarynav
  },
  computed: {
    ...mapState("sites", ["currentSite"]),
    ...mapGetters("sites", ["siteIsLoading", "siteIsLoaded"])
  }
});
</script>

<style>
#branding {
  display: none;
}
</style>
