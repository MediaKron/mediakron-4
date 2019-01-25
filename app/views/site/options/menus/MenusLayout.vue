<template>
<div class="menus-layout pt-4">
        <UtilityNav></UtilityNav> 
        <div id="menus" class="layout-sidebar-left mt-5 container">  
            <div class="row">
                <div class="sidebar-left col-md-4" >
                        <OptionsNav inMenus></OptionsNav> 
                </div>
                <main role="main" class="with-sidebar-left col-md-8" > 
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
