<template>
  <header id="site-header" role="banner">
    <div v-if="isEditing" class="fixed flex items-center top-0 left-0 w-full bg-primary h-12 z-10 px-4 text-center shadow">
        <span class="uppercase text-lg text-white"><font-awesome-icon icon="edit" class="text-lg mt-1" /> Editing</span>
    </div>
    <b-navbar toggleable="md" type="dark" class="site-nav h-12 pr-0 py-0 z-index-1" variant="primary" aria-label="site menus" >
      <b-navbar-toggle target="nav_collapse" class="order-2 pl-3 border-0 navbar-toggle">
      </b-navbar-toggle>
      <b-navbar-brand :to="'/' + currentSite.uri" class="text-uppercase text-2xl ">{{ currentSite.title }}</b-navbar-brand>
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
    ...mapGetters("sites", ["siteIsLoading", "siteIsLoaded"]),
    ...mapGetters("items", ["isEditing"]),
  }
});
</script>

<style>
#branding {
  display: none;
}

#site-header.with-utility-nav .site-nav {
  height:1.5rem;
}

#site-header.with-utility-nav .primarynav,
#site-header.with-utility-nav .secondarynav {
  display:none;
}

#site-header.with-utility-nav .navbar-brand {
  font-size: .8rem
}

</style>
