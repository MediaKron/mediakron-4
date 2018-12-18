<template lang="html">
    <div class="container mt-5">
        <b-card-group deck class="mb-3">
            <b-card :title="'Display Name: ' + user.displayname"
                    header-tag="header"
                    footer-tag="footer">
                <h6 slot="header" class="mb-0">Details</h6>
                <em slot="footer"><router-link :to="{ name: 'user-edit', params: { id: user.id } }">Edit</router-link></em>
                <p class="card-text"><b>Email:</b> {{ user.email }}</p>
                <p class="card-text"><b>Username:</b> {{ user.username }}</p>
                <p class="card-text"><b>Roles:</b></p>
                <ul class="card-text">
                    <li class="card-text" v-for="role in user.roles">{{ role }}</li>
                </ul>
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
export default {
    data() {
        return {
            user: {
                displayname: 'Test User',
                email: 'testuser@bc.edu',
                username: 'testuser',
                roles: [
                    'admin',
                    'super-admin'
                ],
                id: 3,
            }
        }
    }
}
</script>

<style lang="css">
</style>
