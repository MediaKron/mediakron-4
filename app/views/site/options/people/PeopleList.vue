<template>
    <div class="" >
        <div class="loading" v-if="listIsLoading">Loading</div>
       <ul class="loading" v-if="listIsLoaded">
           <li v-for="user in users" v-bind:key="user.id">
               <strong>{{ user.username }}</strong> Role: {{ user.pivot.role }}
           </li>
       </ul>
       dsfasdf
    </div>

</template>

<script>
import {
        mapGetters, mapActions
    } from 'vuex';
export default {
  computed:{
        ...mapGetters('users/profile', [
            'access'
        ]),
        ...mapGetters('users', [
            'users',
            'listIsLoading',
            'listIsLoaded'
        ]),
        ...mapGetters('sites', [
            'currentSite',
            'basePath'
        ])
    },
    methods: {
        linkGen (pageNum) {
            return '/admin/sites/' + pageNum
        },
        ...mapActions("users", [
            "routeLoad"
        ])
    },
    watch: {
        '$route.params.page': function (page) {
            this.routeLoad({to: this.$route, site: this.currentSite });
        }
    },
    mounted() {
        console.log('mounting')
        this.routeLoad({to: this.$route, site: this.currentSite});
    }
}
</script>

<style>

</style>
