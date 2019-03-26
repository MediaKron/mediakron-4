<template>
    <div class="" >
    <main role="main" class="px-6 min-h-screen w-full lg:static lg:max-h-full lg:overflow-visible max-w-2xl">
    <header>
        <h1 class="line-behind heading-nudge-up mb-4">People</h1>
    </header>
    <div class="flex">
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
       
            <b-input-group class="my-3 max-w-sm">
                <b-form-input v-model="filter" placeholder="Type to Search" />
                <b-input-group-append>
                    <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                </b-input-group-append>
            </b-input-group>
    </div>

        <loader v-if="listIsLoading">Loading...</loader>
        <b-table v-if="listIsLoaded" :items="users" :fields="fields" :filter="filter" @filtered="onFiltered" sortBy="updated_at" sort-desc="true" stacked="md">
            <!-- <template slot="username" slot-scope="users">
                {{ users.username }}
            </template>
            <template slot="email" slot-scope="users">
                {{ users.email }}
            </template> -->
        </b-table>
        </main>
    </div>

</template>

<script>
import {
        mapGetters, mapActions
    } from 'vuex';
export default {
    components:{},
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
    data() {
        return {
            fields: {
                username: {
                    label: "Name",
                    sortable: true
                    }, 
                email: {
                    label: "email",
                    sortable: true
                },
                role: {
                    label: "role",
                    sortable: true
                },
            },
            filter: null,
        }

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
