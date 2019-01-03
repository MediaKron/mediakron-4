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

.site-options h2{
    font-size: 1.5rem;
    margin-bottom:0;
}

.card-svg-top {
    display:flex;
    height: 4rem;
    background: #ccc;
    padding: .5em 0;
    width:100%;
    align-content: center;
    justify-content: center;
}

.card-svg-top svg {
    font-size:3rem;
}

.fade-enter-active  {
  transition: opacity .5s;
}
.fade-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
