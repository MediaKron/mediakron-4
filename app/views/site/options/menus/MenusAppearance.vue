<template>
<div class="menus">
        <b-nav pills class="mb-4 line-behind options-sectionnav">
            <b-nav-item :to="basePath + '/options/menus'">Manage</b-nav-item>
            <b-nav-item :to="basePath + '/options/menus/appearance'">Appearance</b-nav-item>
        </b-nav>
        <header>
            <h1 class="heading-nudge-up mb-4"> Menus Appearance</h1>
        </header>

        <OptionsSavebar></OptionsSavebar>
    </div>
</template>
<script>
import OptionsSavebar from '@/components/forms/OptionsSavebar';
import { mapGetters } from 'vuex';
export default {
    components: {
        OptionsSavebar
  },
   computed:{
        ...mapGetters('sites', [
            'basePath'
        ]),
    },
};
</script>

<style>

</style>
