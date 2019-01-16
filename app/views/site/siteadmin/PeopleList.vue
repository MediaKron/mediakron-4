<template>
    <div class="" >
       test
    </div>

</template>

<script>
import {
        mapGetters, mapActions
    } from 'vuex';
export default {
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
