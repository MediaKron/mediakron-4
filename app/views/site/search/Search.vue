<template>
    <div class="search">
        <Navigation></Navigation>

        <main role="main" class="container mx-auto mt-10 max-w-70">
            <header>
                <h1 class=" heading-nudge-up line-behind">Search</h1>
            </header>

            <b-form>
                <b-input-group class="mt-3 w-full">
                    <b-input-group-text slot="prepend" class="bg-white text-black uppercase">
                        <font-awesome-icon icon="search" class="uppercase" />
                    </b-input-group-text>
                    <b-form-input size="lg" class="w-full" type="text" ref="search" placeholder="Enter a search term" />
                    <b-button size="lg" variant="primary" type="submit" slot="append">Submit</b-button>
                </b-input-group>
            </b-form>
        </main>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        mapState,
        mapGetters
    } from 'vuex';
    import Navigation from '@/views/site/Navigation';
    export default Vue.extend({
        components: {
            Navigation,
        },
        computed: {
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
        },
        mounted() {
            // Set focus on search field automatically  
            this.$refs.search.focus();
        }
    });
</script>

<style>

</style>