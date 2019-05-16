<template lang="html">
    <div class="container mx-auto mt-5">
         <h1>User Profile: {{ user.name }}</h1>
         <h2>Details</h2>
         <b-form-group id="exampleInputGroup1"
                label="Email address:"
                label-for="exampleInput1"
                description="We'll never share your email with anyone else.">
            <b-form-input id="exampleInput1"
                type="email"
                v-model="user.email"
                required
                placeholder="Enter email">
              {{ user.email }}
            </b-form-input>
         </b-form-group>
        <h2>Sites</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Url</th>
                    <th scope="col">Operations</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="site in sites" v-bind:key="site.id">
                    <th scope="row">{{ site.id }}</th>
                    <td><router-link :to="{ name: 'homepage', params: { site: site.uri } }">{{ site.title }}</router-link></td>
                    <td>{{ site.uri }}</td>
                    <td>
                        <router-link :to="{ name: 'edit-site', params: { id: site.id } }"><font-awesome-icon icon="coffee" /></router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
export default {
    data() {
        return {
            user: {
                name: 'Austin Bailey',
                email: 'baileyau@bc.edu'
            },
        }
    },
    mounted() {
        this.loadSites({ page: this.page });
    },
    methods: {
        ...mapActions('sites', [
            'loadSites'
        ])
    },
    computed: {
        ...mapGetters('sites',[
            'isLoaded',
            'isLoading',
            'sites'
        ]),
    }
}
</script>

<style scoped lang="scss">

</style>
