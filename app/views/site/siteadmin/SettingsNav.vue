<template>
    <div class="sidebar-left" >
        <div v-if="access('can change site siteadmin')" class="sidebar-sticky">
            <div v-if="access('can change site siteadmin')">
                <b-nav pills vertical class="pb-2 px-3 ">
                    <b-nav-item-dropdown left extra-toggle-classes="text-uppercase pl-4 " extra-menu-classes="">
                        <template slot="button-content">
                           <font-awesome-icon icon="sliders-h"/> 
                             <span class="utilitynav-text">Settings</span>
                        </template>
                        <b-nav-item :to="basePath + '/settings/general'">General</b-nav-item>
                        <b-nav-item :to="basePath + '/settings/canvas'">Canvas</b-nav-item>
                        <b-nav-item :to="basePath + '/settings/searchsettings'" >Search Settings</b-nav-item>
                    </b-nav-item-dropdown>  
                    <b-nav-item v-if="canBrowse" :to="basePath + '/options/menus'">
                    <font-awesome-icon icon="sitemap"/> 
                    <span class="utilitynav-text">Menus</span>
                    </b-nav-item> 
                    <b-nav-item v-if="canBrowse" :to="basePath + '/options/appearance'">
                    <font-awesome-icon icon="paint-brush"/> 
                    <span class="utilitynav-text">Appearance</span>
                    </b-nav-item> 
                    <b-nav-item v-if="canBrowse" :to="basePath + '/options/homepage'">
                    <font-awesome-icon icon="home"/> 
                    <span class="utilitynav-text">Homepage</span>
                    </b-nav-item> 
                    <b-nav-item v-if="canBrowse && changeCount > 0" :to="basePath + '/updates'"><sup>{{ changeCount }}</sup> Changes
                    </b-nav-item > 
                    <b-nav-item :to="basePath + '/options/people'"><font-awesome-icon icon="user-cog"/> 
                    <span class="utilitynav-text">People</span>
                    </b-nav-item >
                    <b-nav-item :to="basePath + '/help'"> <font-awesome-icon icon="question-circle"/> 
                    <span class="utilitynav-text">Help</span>
                    </b-nav-item >
                   
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
