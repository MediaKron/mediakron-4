<template>
    <div class="search">
            <Navigation></Navigation>

            <main role="main" class="container mx-auto mt-10 max-w-2xl" > 
                <header>
                    <h1 class=" heading-nudge-up line-behind">Search</h1>
                </header>

                <b-nav-form class="flex-no-wrap mt-4" >
                    <b-form-input size="lg" class="w-100" type="text" placeholder="Enter a search term" />
                    <b-button size="lg" class="ml-2" type="submit">Search</b-button>
                </b-nav-form>
            </main>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import Navigation from '@/views/site/Navigation';
export default  Vue.extend({
    components: {
        Navigation,
    },
    computed:{
        ...mapState('sites', [
            'currentSite'
        ]),
        ...mapGetters('sites', [
            'siteIsLoading',
            'siteIsLoaded',
            'basePath'
        ]),
        ...mapState('items', [
            'changed',
            'changeCount'
        ]),
        ...mapGetters('items', [
            'tags'
        ]),
    }
});
</script>

<style>

</style>
