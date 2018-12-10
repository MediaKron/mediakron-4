<template lang="html">
    <div class="">
        <h1>User Profile: {{ user.name }}</h1>
        <p>Details</p>
        <p>Email: {{ user.email }}</p>
        <p>Sites</p>
        <div v-for="(site, index) in sites" :key="index">
            <p>{{ site.name }} {{ site.role }}</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                name: 'Austin Bailey',
                email: 'baileyau@bc.edu'
            },
            sites: [
                {
                    link: 'austin',
                    name: "Austin's Site",
                    role: 'administrator'
                },
                {
                    link: 'demo',
                    name: 'Mediakron Demo',
                    role: 'viewer'
                }
            ]
        }
    },
    created() {
        // Runs immediately, before HTML is rendered
        console.log(this.user.email)
    },
    mounted() {
        // Runs after the DOM is mounted, after created()
    }
}
</script>

<style lang="css">
</style>
