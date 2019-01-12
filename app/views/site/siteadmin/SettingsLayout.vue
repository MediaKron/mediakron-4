<template>
    <div class="settings-layout">
        <UtilityNav></UtilityNav> 

         <div class="sidebar-left" >
                <div v-if="access('can change site siteadmin')" class="sidebar-sticky">
           <OptionsNav></OptionsNav> 
                </div>
                </div>
        <div id="site-settings">  
            <div id="wrapper-main" class="justify-content-center sidebar-left-wrapper" >
                 <main role="main" class="sidebar-left-main" > 
                     <transition name="fade">
                         s
                            <router-view></router-view>
                     </transition>
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

.fade-enter-active  {
  transition: opacity .5s;
}
.fade-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
