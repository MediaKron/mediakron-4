<template>
  <div id="login-form">
    <div id="login-banner">
      <div id="branding">
        <h1 class="page-header">
          <span id="site-name">
            <a href="home">{{ name }}</a>
          </span>
        </h1>
      </div>
    </div>

    <div id="login">
      <h2 class="sr-only">Log in</h2>
      <div id="login-image">
        <img :src="require('@/assets/images/mklogo-horizontal-300.png')" alt="MediaKron Logo">
      </div>

        <div class="form-item form-type-textfield form-item-name">
          <label class="sr-only" for="username">Username
            <span class="form-required" title="This field is required.">*</span>
          </label>
          <b-form-input v-model="username"
                  type="text"
                  id="username"
                  name="name"
                  value
                  class="form-text required"
                  placeholder="Username"
                  v-validate="'required'"></b-form-input>
                  
          <span>{{ errors.first('username') }}</span>

          <div
            class="login-instructions"
          >If you are a BU user, please use your basic BU ID as username. Otherwise, use your email address.</div>
        </div>
        <div class="form-item form-type-password form-item-pass">
          <label class="sr-only" for="password">Password
            <span class="form-required" title="This field is required.">*</span>
          </label>
          <b-form-input v-model="password"

                  type="password"
                  id="password"
                  name="name"
                  value
                  class="form-text required"
                  placeholder="Password"
                  v-validate="'required'"></b-form-input>
            <span>{{ errors.first('password') }}</span>
          <div class="login-instructions"></div>
        </div>
        <input type="hidden" name="form_id" value="user_login">
        <div class="form-actions form-wrapper" id="edit-actions">
          <input type="submit" id="login-submit" name="op" value="Log in" class="form-submit" @click="fireLogin">
        </div>
        <router-link to="/reset" class="forgot-password">I forgot my password</router-link>

    </div>
  </div>
</template>

<script>
    import {
        mapGetters, mapActions
    } from 'vuex';
export default {
  data(){
    return {
      username: '',
      password: ''
    }
  },
  computed:{
    name(){
      return 'name'
    },
    ...mapGetters('users/profile', [
      'isLoggedIn',
      'isLoading',
      'isLoggingIn'
    ])
  },
  methods:{
    ...mapActions('users/profile', [
      'login'
    ]),
    fireLogin(){
      this.login({ username: this.username, password: this.password});
    }
  }
};
</script>

<style lang="scss" scoped>
#login{
  padding: 2em;
  width: 100%; 
  z-index: 10000;
  background: #ddd;
  border: 1px solid #ccc;
  max-width: 400px;
  margin: 6em auto 0 auto;
  border-radius: 5px;
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  #login-image{
    padding: 1em 1em;
    background: #fff;
    text-align: center;
    display: block;
    width: auto;
    margin-bottom: 1.5em;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
}
  
</style>

