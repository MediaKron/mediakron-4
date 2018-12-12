<template>
    <div class="container">
        <h1>Site List</h1>
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
    components: {},
    computed:{
        ...mapGetters('sites',[
            'isLoaded',
            'isLoading',
            'sites'
        ]),
        page(){
            return 1;
        }
    },
    methods:{
        ...mapActions('sites', [
            'loadSites'
        ])
    },
    mounted(){
        this.loadSites({ page: this.page });
    }
};
</script>

<style>
    
</style>
