<template>
<div class="menus">
    <main role="main" class="px-6 min-h-screen w-full lg:static lg:max-h-full lg:overflow-visible max-w-lg">
        <header>
            <h1 class="line-behind heading-nudge-up mb-4"> Manage Menus</h1>
        </header>

        <OptionsSavebar></OptionsSavebar>
    </main>
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
