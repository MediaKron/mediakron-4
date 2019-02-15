<template>
    <div class="settings-layout pt-4">
        <UtilityNav></UtilityNav> 
        <div id="site-settings" class="layout-sidebar-left mt-5 container">  
            <div class="row">
                <div class="sidebar-left col-md-4" >
                        <OptionsNav inSettings></OptionsNav> 
                </div>
                <main role="main" class="with-sidebar-left col-md-8" > 
                    <b-nav class="mb-4 line-behind options-sectionnav">
                        <b-nav-item :to="basePath + '/options/settings/general'">General</b-nav-item>
                        <b-nav-item :to="basePath + '/options/settings/canvas'">Canvas</b-nav-item>
                        <b-nav-item :to="basePath + '/options/settings/searchsettings'" >Search Settings</b-nav-item>
                    </b-nav>
                     <router-view></router-view>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import UtilityNav from "./../../navigation/UtilityNav";
import OptionsNav from "./../../navigation/OptionsNav";
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
