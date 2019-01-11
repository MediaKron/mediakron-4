<template>
    <div class="site-options">
        Settings lander
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
