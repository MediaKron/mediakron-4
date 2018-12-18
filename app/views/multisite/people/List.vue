<template lang="html">
    <div class="container mt-5">
        <h1>People</h1>
        <div v-if="listIsLoading" class="skeleton">Loading Table Skeleton here</div>
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

export default {
    data() {
        return {
            /*users: [
                {
                    username: 'baileyau',
                    email: 'baileyau@bc.edu',
                    displayname: 'Austin Bailey',
                    roles: [
                        'admin',
                    ],
                    id: 1,
                },
                {
                    username: 'walkerjj',
                    email: 'walkerjj@bc.edu',
                    displayname: 'Jamie Walker',
                    roles: [
                        'admin',
                    ],
                    id: 2,
                }
            ],*/
            fields: {
              displayname: {
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
              roles: {
                label: "Roles",
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
</style>
