<template>
    <div class="collapse navbar-collapse navbar-ex1-collapse show">
        <ul id="nav" class="nav navbar-nav">
            <li>
                <router-link to="/help/mediakron-basics">About</router-link>
            </li>
            <li>
                <router-link to="/help">Support</router-link>
            </li>
            <li>
                <a href="mailto:mediakron@bc.edu">Contact</a>
            </li>
    
            <li>
                <router-link to="/profile">My Account</router-link>
            </li>
            <li v-if="isAdmin" class="dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Administration <span class="caret"></span></a>
                <ul class="dropdown-menu" role="menu">
                    <li><router-link to="/admin/sites">Sites</router-link></li>
                    <li><router-link to="/admin/groups">Groups</router-link></li>
                    <li><router-link to="/admin/people">People</router-link></li>
                </ul>
            </li>
            <li><router-link to="/logout">Logout</router-link></li>
        </ul>
        <a href="http://www.bc.edu" id="bclogo"><img src="/bundles/mediakron/img/bclogo.png" alt="Boston College"></a>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        mapGetters
    } from 'vuex';
    export default Vue.extend({
        computed: {
            ...mapGetters('users/profile', [
                'isLoaded',
                'isAdmin'
            ])
        }
    });
</script>

<style>
    
</style>
