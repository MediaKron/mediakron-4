<template>
    <div class="people max-w-5xl mx-auto">
        <main role="main" class="">
            <header>
                <h1 class="line-behind heading-nudge-up mb-4">People</h1>
            </header>
            <div class="flex items-center">

                <b-input-group class="my-3 max-w-sm mr-auto">
                    <b-form-input v-model="filter" placeholder="Type to Search" />
                    <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                    </b-input-group-append>
                </b-input-group>

                <div class="add-people ml-3">
                    <b-btn v-b-modal.add-people-form variant="primary" class="text-uppercase">
                        <font-awesome-icon icon="user-plus" /> Add New Users</b-btn>
                    <b-modal id="add-people-form" centered title="Add People" ok-title="Save">
                        <b-form @submit.prevent="updateUser">

                            <b-form-group label="Add Users"
                                description="One per row. For Boston University users, add a username or email address. NOTE: BU emails must be the username version (e.g. doeja@bu.edu), not the longer version (e.g. jane.doe@bu.edu). For non-BC users, just add an email address">
                                <b-form-textarea id="textarea1" v-model="newUserList" placeholder="baileyau@bu.edu"
                                    :rows="3" :max-rows="6"></b-form-textarea>
                            </b-form-group>

                            <b-form-group label="Role">
                                <b-form-select v-model="newUserType" :options="options" class="mb-3"></b-form-select>
                            </b-form-group>

                            <b-button type="submit" variant="primary" size="sm" class="text-uppercase">
                                <font-awesome-icon icon="check" /> Add</b-button>
                        </b-form>
                    </b-modal>
                </div>

            </div>

            <loader v-if="listIsLoading">Loading...</loader>

            <b-table v-if="listIsLoaded" :items="users" :fields="fields" :filter="filter" sortBy="updated_at"
                sort-desc="true" no-local-sorting @sort-changed="sortBy" stacked="md" class="mt-4 mb-8 table-bordered">
                <template slot="username" slot-scope="data">
                    {{ data.item.username }}
                </template>
                <template slot="email" slot-scope="data">
                    {{ data.item.email }}
                </template>
                 <template slot="remove" slot-scope="data">
                    <b-button class="bg-none"><font-awesome-icon icon="window-close" /><span class="sr-only">Remove {{ data.item.username }}</span> </b-button>
                </template>
            </b-table>
            <b-pagination-nav v-if="listIsLoaded" :link-gen="linkGen" :number-of-pages="lastPage" use-router />
        </main>
    </div>

</template>

<script>
    import Loader from '@/components/Loader';
    import {
        mapGetters,
        mapActions
    } from 'vuex';
    export default {
        components: {
            Loader
        },
        computed: {
            ...mapGetters('users/profile', [
                'access'
            ]),
            ...mapGetters('users', [
                'users',
                'listIsLoading',
                'listIsLoaded',
                'lastPage',
                'currentPage'
            ]),
            ...mapGetters('sites', [
                'currentSite',
                'basePath'
            ])
        },
        methods: {
            linkGen(pageNum) {
                return '/' + this.currentSite.uri + '/options/people/' + pageNum
            },
            ...mapActions("users", [
                "routeLoad"
            ]),
            sortBy(sort) {
                var direction = 'ASC';
                if (sort.sortDesc) direction = 'DESC'
                this.$router.push({
                    query: {
                        sort: 'users.' + sort.sortBy,
                        direction: direction
                    }
                });
            }
        },
        data() {
            return {
                fields: {
                    username: {
                        label: "Name",
                        sortable: true
                    },
                    email: {
                        label: "Email",
                        sortable: true
                    },
                    role: {
                        label: "Role",
                        sortable: true
                    },
                    remove: {
                        label: "Remove",
                        sortable: true
                    },
                },
                filter: null,
                newUserType: '',
                newUserList: '',
                options: [
                    'member',
                    'administrator'
                ]
            }

        },
        watch: {
            '$route.params.page': function (page) {
                this.routeLoad({
                    to: this.$route,
                    site: this.currentSite
                });
            },
            '$route.query.sort': function (page) {
                this.routeLoad({
                    to: this.$route,
                    site: this.currentSite
                });
            },
            '$route.query.direction': function (page) {
                this.routeLoad({
                    to: this.$route,
                    site: this.currentSite
                });
            }
        },
        mounted() {
            this.routeLoad({
                to: this.$route,
                site: this.currentSite
            });
        }
    }
</script>

<style>

</style>