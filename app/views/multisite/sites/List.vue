<template>
  <div class="container mt-5">
    <h1>Site List</h1>
    <b-table striped hover :items="sites" :fields="fields">
      <template slot="title" slot-scope="site">
        <router-link :to="{ name: 'homepage', params: { site: site.item.uri } }">{{ site.item.title }}</router-link>
      </template>
      <template slot="operations" slot-scope="site">
        <router-link :to="{ name: 'edit-site', params: { id: site.item.id } }">
            Edit
        </router-link>
        <router-link :to="{ name: 'site-overview', params: { uri: site.item.uri } }">
            View
        </router-link>
      </template>
    </b-table>
    <b-pagination-nav :link-gen="linkGen" :number-of-pages="lastPage" use-router />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
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
  components: {},
  computed: {
    ...mapGetters("sites", ["isLoaded", "isLoading", "sites", 'currentPage', "totalItems", "lastPage"]),
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
</style>
