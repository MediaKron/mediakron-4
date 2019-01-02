<template>
    <div class="settings-layout">
        <UtilityNav></UtilityNav> 
        <div id="site-settings">  
            <SettingsNav></SettingsNav>          
            <div id="wrapper-main" class="justify-content-center sidebar-left-wrapper" >
                 <main role="main" class="sidebar-left-main" > 
                     <transition name="fade">
                            <router-view></router-view>
                     </transition>
                 </main>
             </div>
        </div>
    </div>
</template>

<script>
import SettingsNav from "./SettingsNav.vue";
import UtilityNav from "./../navigation/UtilityNav";
export default {
    components: {
        SettingsNav,
        UtilityNav
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
