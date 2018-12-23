<template>
    <div>
        <section id="settings-context" class="container-fluid " >
            <div class="row">
                <nav class="d-none d-md-block bg-light sidebar ">
                    <settingsnav></settingsnav>
                </nav>
                <div class="col-md-9 ml-sm-auto col-lg-10 px-4 pt-5">
                    <transition name="fade">
                    <router-view></router-view>
                    </transition>
                </div>        
            </div>
        </section>
    </div>
</template>

<script>
import Settingsnav from "./settings/SettingsNav.vue";
export default {
  components: {
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
