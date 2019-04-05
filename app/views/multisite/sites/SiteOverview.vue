<template lang="html">
    <div class="container mt-5">
        <h1>Site: {{ currentSite.title }}</h1>
        <b-card-group deck class="mb-3">
            <b-card header-tag="header"
                    footer-tag="footer">
                <h6 slot="header" class="mb-0">Details</h6>
                <ul>
                    <li>Site Address:  {{ currentSite.uri }}</li>
                    <li>Created At: {{ currentSite.created_at }}</li>
                    <li>Creator: {{ currentSite.creator_id }}</li>
                    <li>Adsministrator: {{ currentSite.administrator_id }}</li>
                </ul>

                <em slot="footer"><router-link :to="{ name: 'edit-site', params: { id: currentSite.id } }">Edit</router-link></em>

                <em slot="footer"> | <router-link :to="{ name: 'clone-site', params: { id: currentSite.id } }">Clone</router-link></em>
            </b-card>
        </b-card-group>
        <div class="container mt-5">
            <h1>Members</h1>
            
        </div>
        <div class="container mt-5">
            <h1>Groups</h1>

        </div>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
    computed: {
        ...mapGetters("sites", ["isLoaded", "isLoading", "currentSite"]),
        ...mapGetters("users", ["users"]),
    },
    methods: {
        ...mapActions("sites", ["loadSite"]),
        ...mapActions("users", ["loadUsers"]),
    },
    created() {
        this.loadSite(this.$route.params.uri)
        this.loadUsers()
        console.log(this.users)
    },
}
</script>

<style lang="css">
</style>
