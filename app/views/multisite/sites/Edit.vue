<te<template lang="html">
    <div class="container mt-5">
        <b-card header-tag="header">
            <h2 slot="header" class="mb-0">Edit Site Details</h2>
            <b-form @submit.prevent="updateSite">
                <b-form-group
                        label="Site Address: ">
                    <b-form-input
                            type="text"
                            v-model="currentSite.uri"
                            placeholder="">
                    </b-form-input>
                </b-form-group>
                <b-form-group
                        label="Site Title: "
                        label-for="exampleInput1"
                        description="">
                    <b-form-input
                            type="text"
                            v-model="currentSite.title"
                            placeholder="">
                    </b-form-input>
                </b-form-group>
                <b-form-group
                        label="GA Name: ">
                    <b-form-input
                            type="text"
                            v-model="currentSite.ga"
                            placeholder="">
                    </b-form-input>
                </b-form-group>

                <b-form-group id="exampleGroup4">
                    <b-form-checkbox-group>
                        <b-form-checkbox value="comments">Comment</b-form-checkbox>
                        <b-form-checkbox value="public">Public</b-form-checkbox>
                        <b-form-checkbox value="production">Production</b-form-checkbox>
                        <b-form-checkbox value="downloadr">Download</b-form-checkbox>
                    </b-form-checkbox-group>
                </b-form-group>
                <b-button type="submit" variant="primary">Submit</b-button>
            </b-form>
        </b-card>
    </div>
</template>

<script>
    import { mapActions, mapState, mapGetters } from "vuex";
    export default {
        created() {
            this.getSite(this.$route.params.id)
        },
        computed: {
            ...mapGetters("sites", ["currentSite"]),
        },
        methods: {
            updateSite() {
                this.update()
                this.saveSite()
            },
            ...mapActions("sites", ["getSite", "update", "saveSite"]),
        },
    }
</script>

<style lang="css">
</style>
