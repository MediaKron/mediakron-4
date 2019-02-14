<template>
<div>
    
    <b-container class="mt-12 layout-sidebar-left ">
    <div class="row">
    
        <main role="main" class="col-md-12" > 
            <header>
            <h1 class="line-behind heading-nudge-up"> Content Browser</h1>
                </header>

        <content-card></content-card>
        </main>
    </div>
    </b-container>  
</div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import ContentCard from "./ContentCard";
export default  Vue.extend({
     components: {
        ContentCard
    },
    computed:{
        ...mapGetters('sites', [
            'siteIsLoading',
            'siteIsLoaded',
            'basePath'
        ])
    },
    mounted(){
        
    }
});
</script>

<style>

</style>
