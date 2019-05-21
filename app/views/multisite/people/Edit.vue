<template lang="html">
    <div class="container mx-auto mt-5">
        <b-card header-tag="header">
            <h6 slot="header" class="mb-0">Edit User Details</h6>
            <b-form>
                <b-form-group
                       label="Username:">
                   <b-form-input
                                 type="text"
                                 v-model="currentUser.username"
                                 required
                                 placeholder="">
                   </b-form-input>
                </b-form-group>
                <b-form-group
                       label="Email Address:"
                       label-for="exampleInput1"
                       description="We'll never share your email with anyone else.">
                   <b-form-input
                                 type="email"
                                 v-model="currentUser.email"
                                 required
                                 placeholder="">
                   </b-form-input>
                </b-form-group>
                <b-form-group
                       label="Display Name:">
                   <b-form-input
                                 type="text"
                                 v-model="currentUser.display_name"
                                 required
                                 placeholder="">
                   </b-form-input>
                </b-form-group>
                <b-form-group
                       label="New Password:">
                   <b-form-input
                                 type="password"
                                 v-model="currentUser.newPassword"
                                 placeholder="">
                   </b-form-input>
                </b-form-group>
                <b-form-group
                       label="Repeat New Password:">
                   <b-form-input
                                 type="password"
                                 v-model="currentUser.repeatNewPassword"
                                 placeholder="">
                   </b-form-input>
                </b-form-group>
                <b-form-group id="exampleGroup4">
                    <b-form-checkbox-group>
                        <b-form-checkbox value="enabled">Enabled</b-form-checkbox>
                        <b-form-checkbox value="isBcUser">Is BC User</b-form-checkbox>
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
