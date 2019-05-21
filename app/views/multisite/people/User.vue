<template lang="html">
    <div class="container mx-auto mt-5">
        <b-card-group deck class="mb-3">
            <b-card :title="'Display Name: ' + currentUser.display_name"
                    header-tag="header"
                    footer-tag="footer">
                <h6 slot="header" class="mb-0">Details</h6>
                <em slot="footer"><router-link :to="{ name: 'user-edit', params: { id: currentUser.id } }">Edit</router-link></em>
                <p class="card-text"><b>Email:</b> {{ currentUser.email }}</p>
                <p class="card-text"><b>Username:</b> {{ currentUser.username }}</p>
                <p class="card-text"><b>Role:</b> {{ (currentUser.admin ? "Admin" : "Not Admin" )}}</p>
            </b-card>
        </b-card-group>
        <b-card-group deck class="mb-3">
            <b-card
                    header-tag="header"
                    footer-tag="footer">
                <h6 slot="header" class="mb-0">Sites</h6>
                <em slot="footer"><router-link :to="{ name: 'user-edit', params: {} }">Edit</router-link></em>
            </b-card>
        </b-card-group>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
    created() {
        this.getUser(this.$route.params.id)
    },
    computed: {
        ...mapGetters("users", ["currentUser"]),
    },
    methods: {
        ...mapActions("users", ["getUser"]),
    },
}
</script>

<style lang="css">
</style>
