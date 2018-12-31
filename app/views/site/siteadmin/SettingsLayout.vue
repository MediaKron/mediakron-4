<template>
     <div id="site-settings" class="admin-site-layout">  
        <SettingsNav></SettingsNav>          
        <div id="wrapper-main" class="">
            <div class="justify-content-center sidebar-left-wrapper" >
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
export default {
    components: {
        SettingsNav
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
