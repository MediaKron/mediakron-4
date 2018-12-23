<template>
  <header id="header" role="banner">
    <b-navbar toggleable="md" type="dark" class="px-2 py-0" fixed="top" variant="primary">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand :to="'/' + currentSite.uri" class="text-uppercase">{{ currentSite.title }}</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
          <primary v-if="currentSite && siteIsLoaded"></primary>
          <secondary v-if="currentSite && siteIsLoaded"></secondary>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters } from "vuex";
import Primary from "./navigation/Primary";
import Secondary from "./navigation/Secondary";
export default Vue.extend({
  components: {
    Primary,
    Secondary
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
