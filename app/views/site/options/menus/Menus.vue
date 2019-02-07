<template>
<div class="menus">

        <header>
            <h1 class="heading-nudge-up mb-4"> Manage Menus </h1>
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
