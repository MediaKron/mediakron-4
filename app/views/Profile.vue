<template lang="html">
    <div class="">
        <h1>User Profile: {{ user.name }}</h1>
        <p>Details</p>
        <p>Email: {{ user.email }}</p>
        <p>Sites</p>
        <div v-for="(site, index) in sites" :key="index">
            <p>{{ site.name }} | {{ site.role }}</p>
        </div>
        <div v-if="render">
            hello
        </div>
        <button @click="render = !render">Toggle v-if</button>
        <form @submit.prevent="submitForm">
            <input type="text" v-model="form.name">
            <input type="text" v-model="form.role">
            <button type="submit" name="button">Submit fake form</button>
        </form>
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
            ],
            render: true,
            form: {
                name: '',
                role: '',
            }
        }
    },
    created() {
        // Runs immediately, before HTML is rendered
        console.log(this.user.email)
        this.customFunction()
    },
    mounted() {
        // Runs after the DOM is mounted, after created()
    },
    methods: {
        // Methods for whatever
        customFunction() {
            // Do whatever
            console.log("In custom function")
        },
        submitForm(event) {
            console.log(this.form)
        }
    },
    computed: {
        // Basically replaces mustache code to clean it up
    }
}
</script>

<style lang="css">

</style>
