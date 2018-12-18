<template lang="html">
    <div class="container mt-5">
        <h1>People</h1>
        <b-table striped hover :items="users" :fields="fields">
            <template slot="username" slot-scope="user">
              <router-link :to="{ name: 'user', params: { id: user.item.id } }">{{ user.item.username }}</router-link>
            </template>
        </b-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            users: [
                {
                    username: 'baileyau',
                    email: 'baileyau@bc.edu',
                    displayname: 'Austin Bailey',
                    roles: [
                        'admin',
                    ],
                    id: 1,
                },
                {
                    username: 'walkerjj',
                    email: 'walkerjj@bc.edu',
                    displayname: 'Jamie Walker',
                    roles: [
                        'admin',
                    ],
                    id: 2,
                }
            ],
            fields: {
              displayname: {
                label: "Display Name",
                sortable: true
              },
              email: {
                label: "Email",
                sortable: true
              },
              username: {
                label: "Username",
                sortable: true
              },
              roles: {
                label: "Roles",
                sortable: false
              }
            }
        }
    }
}
</script>

<style lang="css">
</style>
