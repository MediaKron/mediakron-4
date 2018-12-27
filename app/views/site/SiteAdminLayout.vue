<template>
     <div id="main-container" class="utilitynav-gap">

        <utilitynav></utilitynav>
                
        <div id="wrapper-main">
            <main role="main"> 
                <nav class="bg-light sidebar ">
                     <settingsnav></settingsnav>
                </nav>
                <section class="container-fluid " >
                    <div class="row">
                        <div class="col-md-8 col-lg-10 px-4 pt-5">
                            <transition name="fade">
                            <router-view></router-view>
                            </transition>
                        </div>        
                    </div>
                </section>
             </main>
         </div>
    </div>

</template>

<script>
import Navigation from './Navigation'
import Utilitynav from "./navigation/UtilityNav";
import Settingsnav from "./siteadmin/SettingsNav.vue";
export default {
    components: {
        Navigation,
        Utilitynav,
        Settingsnav
  }
};
</script>

<style>

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
