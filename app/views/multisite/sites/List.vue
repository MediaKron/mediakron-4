<template>
  <div class="container mt-5">
    <h1>Site List</h1>

    <transition  name="fade">
       <div v-if="listIsLoading" class="bg-light px-4 py-2 mb-3"> 
            <bar-loader  color="#303030" height="6" width="200" size="150" sizeUnit="px" class="d-inline-block"> </bar-loader>
            <span class="d-inline-block pl-3 font-weight-bold">Loading... </span>
        </div>
     </transition>

    <b-table v-if="listIsLoaded" striped hover :items="sites" :fields="fields">
      <template slot="title" slot-scope="site">
        <router-link :to="{ name: 'homepage', params: { site: site.item.uri } }">{{ site.item.title }}</router-link>
      </template>
      <template slot="operations" slot-scope="site">
        <router-link :to="{ name: 'site', params: { id: site.item.id } }">
            View
        </router-link>
        <router-link :to="{ name: 'site-overview', params: { uri: site.item.uri } }">
            Manage
        </router-link>
      </template>
    </b-table>

    <b-pagination-nav :link-gen="linkGen" :number-of-pages="lastPage" use-router />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { BarLoader } from '@saeris/vue-spinners'
export default {
   components:{
        BarLoader
    },
  data() {
    return {
      // Note 'isActive' is left out and will not appear in the rendered table
      fields: {
        id: {
          label: "ID",
          sortable: true
        },
        title: {
          label: "Site Name",
          sortable: true
        },
        uri: {
          label: "uri",
          sortable: true
        },
        operations: {
          label: "Operations",
          sortable: false
        }
      }
    };
  },
  computed: {
    ...mapGetters("sites", ["listIsLoading", "listIsLoaded", "sites", 'currentPage', "totalItems", "lastPage"]),
    ...mapState("sites", ["pagination"]),
  },
  methods: {
    linkGen (pageNum) {
      return '/admin/sites/' + pageNum
    },
    ...mapActions("sites", ["routeLoad"])
  },
  watch: {
    '$route.params.page': function (page) {
      this.routeLoad({to: this.$route});
    }
  },
  mounted() {
    this.routeLoad({to: this.$route});
  }
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
