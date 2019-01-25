<template>
    <div class="people-layout pt-4">
        <UtilityNav></UtilityNav> 
        <div id="people" class="layout-sidebar-left mt-5 container">  
            <div class="row">
                <div class="sidebar-left col-md-4" >
                        <OptionsNav inPeople></OptionsNav> 
                </div>
                <main role="main" class="with-sidebar-left col-md-8" > 
                    <div class="menus">
                        <b-nav pills class="mb-4 line-behind options-sectionnav ">
                            <b-nav-item> Manage</b-nav-item>
                            <b-nav-item><font-awesome-icon icon="user-plus"/><router-link :to="{ name: 'people-add' }">Add People</router-link></b-nav-item>
                            <b-nav-item><font-awesome-icon icon="users"/> Groups</b-nav-item>
                        </b-nav>
                        <header>
                            <h1 class="heading-nudge-up mb-4"> People</h1>
                        </header>
                        <router-view></router-view>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import UtilityNav from "./../navigation/UtilityNav";
import OptionsNav from "./../navigation/OptionsNav";
import {
        mapGetters
    } from 'vuex';
export default {
    components: {
        UtilityNav,
        OptionsNav
  },
  computed:{
        ...mapGetters('users/profile', [
            'access'
        ]),
        ...mapGetters('sites', [
            'currentSite',
            'basePath'
        ])
    }
};
</script>

<style>

</style>
