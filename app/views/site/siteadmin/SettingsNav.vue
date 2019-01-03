<template>
    <div class="sidebar-left" >
        <div v-if="access('can change site siteadmin')" class="sidebar-sticky">
            <div v-if="access('can change site siteadmin')">
                <b-nav pills vertical class="pb-2 px-3 ">
                    <b-nav-text class="py-1 pl-3 mb-2 font-weight-bold text-uppercase"> <font-awesome-icon icon="sliders-h"/> Site Settings</b-nav-text>  
                    <b-nav-item :to="basePath + '/settings/general'">General</b-nav-item>
                    <b-nav-item :to="basePath + '/settings/canvas'">Canvas</b-nav-item>
                    <b-nav-item :to="basePath + '/settings/searchsettings'" >Search Settings</b-nav-item>
                </b-nav>  
            </div>
        </div>
    </div>

</template>

<script>
import {
        mapGetters, mapActions
    } from 'vuex';
export default {
  name: 'SettingsNav',
  computed:{
        ...mapGetters('users/profile', [
            'access'
        ]),
        ...mapGetters('sites', [
            'currentSite',
            'basePath'
        ])
    }
}
</script>

<style>

</style>
