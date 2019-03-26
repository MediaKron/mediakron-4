<template>
<div class="search">
        <Navigation></Navigation>
<b-container class="mt-12 layout-sidebar-left ">

    <div class="row">

                <main role="main" class="with-sidebar-left col-md-12" > 
                   <header>
                    <h1 class=" heading-nudge-up line-behind">Search</h1>
                     </header>
   
                </main>
    </div>
 </b-container>   
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
    },
    mounted(){
        
    }
});
</script>

<style>

</style>
