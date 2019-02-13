<template>
    <div class="settings-layout pt-4">
        <UtilityNav></UtilityNav> 
       <div class="w-full max-w-xl mx-auto px-6 mt-16 ">
                <div class="flex">
                    <div id="sidebar" class="hidden min-w-64 max-w-xs lg:block ">
                        <div class="lg:relative lg:sticky top-20">
                            <OptionsNav inSettings class="sticky?lg:h-(screen-20) overflow-y-auto "></OptionsNav> 
                    </div>
                </div>
                <main role="main" id="content-wrapper" class="px-6 min-h-screen w-full lg:static lg:max-h-full lg:overflow-visible max-w-lg"> 
                    <b-nav class="mb-4 options-sectionnav">
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
