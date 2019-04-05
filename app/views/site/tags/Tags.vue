<template>
<div class="tags">
    <Navigation></Navigation>
    <b-container class="mt-12 layout-sidebar-left ">

    <div class="row">

                <main role="main" class="with-sidebar-left col-md-12" > 
                   <header>
                        <h1 class=" heading-nudge-up line-behind">Tags</h1>
                    </header>
                    <b-table v-if="tagsLoaded" :items="tags"  sortBy="updated_at" :sort-desc="true" stacked="md">
                    
                    </b-table>


                </main>
    </div>
 </b-container>   
</div>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapState, mapGetters } from 'vuex';
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
            'changeCount',
            'tagsLoading',
            'tagsLoaded'
        ]),
        ...mapGetters('items', [
            'tags'
        ]),
    },
    methods: {
        ...mapActions('items', [
            'getTags'
        ]),
    },

    mounted(){
        this.getTags()
    }
});
</script>

<style>

</style>
