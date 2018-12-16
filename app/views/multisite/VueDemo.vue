<template lang="html">
  <div class="container mt-5">
      <h1>User Profile: {{ user.name }}</h1>
      <h2>Details</h2>
      <b-form-group id="exampleInputGroup1"
             label="Email address:"
             label-for="exampleInput1"
             description="We'll never share your email with anyone else.">
         <b-form-input id="exampleInput1"
             type="email"
             v-model="user.email"
             required
             placeholder="Enter email">
           {{ user.email }}
         </b-form-input>
      </b-form-group>

      <div v-if="render">
          hello
      </div>
      <b-button @click="render = !render">Toggle v-if</b-button>
      <form @submit.prevent="submitForm">
          <input type="text" v-model="form.name">
          <input type="text" v-model="form.role">
          <b-button type="submit" name="button" variant="primary">Submit fake form</b-button>
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
            render: false,
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
        submitForm() {
            // Run request here
            console.log(this.form)
        },
        customFunction() {
            // Do whatever
            console.log("In custom function")
        },
    },
    computed: {
        // Basically replaces mustache code to clean it up, simple logic
    }
}
</script>

<style lang="css">
</style>
