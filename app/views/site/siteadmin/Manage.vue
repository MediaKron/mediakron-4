<template>
     <div id="site-settings" class="admin-site-layout">

        <navigation class="with-utility-nav"></navigation>
        <utilitynav></utilitynav>
                
       
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

.admin-site-layout {
    margin-top: 3rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
