<template>
    <div class="" >
    <header>
        <h1 class="heading-nudge-up mb-4"> Manage Site Users</h1>
    </header>
    <div class="add-people">
        <b-btn v-b-toggle.collapse1 variant="primary" size="sm" class="text-uppercase"><font-awesome-icon icon="user-plus"/> Add New Users</b-btn>
        <b-collapse id="collapse1" class="mt-3">
           
            <b-form @submit.prevent="updateUser">
      
                <b-form-group
                    label="Add Users"
                    description="One per row. For Boston College users, add a username or email address. NOTE: BC emails must be the username version (e.g. doeja@bc.edu), not the longer version (e.g. jane.doe@bc.edu). For non-BC users, just add an email address"
                    >
                        <b-form-textarea
                        id="textarea1"
                        v-model="text"
                        placeholder="baileyau@bc.edu"
                        :rows="3"
                        :max-rows="6"
                        ></b-form-textarea>
                </b-form-group>

                <b-form-group label="Role">
                    <b-form-select v-model="newUserType" :options="options" class="mb-3"></b-form-select>
                </b-form-group>

                <b-button type="submit" variant="primary" size="sm" class="text-uppercase"><font-awesome-icon icon="check"/> Add</b-button>
           </b-form>
        </b-collapse>

    </div>
    <h2 class="mt-4"> Current Users</h2>
        <loader v-if="listIsLoading"></loader>
        <ul class="loading" v-if="listIsLoaded">
            <li v-for="user in users" v-bind:key="user.id">
                <strong>{{ user.username }}</strong> Role: {{ user.pivot.role }}
            </li>
        </ul>

       [load table here]
    </div>

</template>

<script>
import {
        mapGetters, mapActions
    } from 'vuex';
import { BarLoader } from '@saeris/vue-spinners'
export default {
    components:{
        BarLoader
    },
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
