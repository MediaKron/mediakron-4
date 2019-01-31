<template lang="html">
    <div class="container mt-5">
        <h1>People</h1>
          <loader v-if="listIsLoading"></loader>
        <b-table v-if="listIsLoaded" striped hover :items="users" :fields="fields">
            <template slot="username" slot-scope="user">
              <router-link :to="{ name: 'user', params: { id: user.item.id } }">{{ user.item.username }}</router-link>
            </template>
        </b-table>

        <b-pagination-nav :link-gen="linkGen" :number-of-pages="lastPage" use-router />
     

    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import Loader from '@/components/Loader';
export default {
     components:{
        Loader
    },
    data() {
        return {
            fields: {
              display_name: {
                label: "Display Name",
                sortable: true
              },
              email: {
                label: "Email",
                sortable: true
              },
              username: {
                label: "Username",
                sortable: true
              },
              admin: {
                label: "Admin",
                sortable: false
              }
            }
        }
    },
    computed: {
    ...mapGetters("users", ["listIsLoaded", "listIsLoading", "users", 'currentPage', "totalItems", "lastPage"]),
    ...mapState("users", ["pagination"]),
    },
    methods: {
        linkGen (pageNum) {
            return '/admin/people/' + pageNum
        },
        ...mapActions("users", ["routeLoad"])
    },
    watch: {
        '$route.params.page': function (page) {
            this.routeLoad({to: this.$route});
        }
    },
    mounted() {
        this.routeLoad({to: this.$route});
    }
}
</script>

<style lang="css">

.fade-enter-active, .fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
