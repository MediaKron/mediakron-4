<template lang="html">
    <div class="container mt-5">
        <b-card-group deck class="mb-3">
            <b-card :title="'Site Name: ' + currentSite.title"
                    header-tag="header"
                    footer-tag="footer">
                <h6 slot="header" class="mb-0">Details</h6>
                <em slot="footer"><router-link :to="{ name: 'edit-site', params: { id: currentSite.id } }">Edit</router-link></em>
            </b-card>
        </b-card-group>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
    computed: {
        ...mapGetters("sites", ["isLoaded", "isLoading", "currentSite"]),
    },
    methods: {
        ...mapActions("sites", ["getSite"])
    },
    created() {
        this.getSite(this.$route.params.uri)
        console.log(this.currentSite)
    },
}
</script>

<style lang="css">
</style>
