<template>
<div>
    
    <b-container class="mt-12 layout-sidebar-left ">
    <div class="row">
<<<<<<< HEAD
    
        <main role="main" class="col-md-12" > 
=======
        <!-- <div class="sidebar-left col-md-4" >
        
        </div> -->
        <main role="main" class="with-sidebar-left col-md-12" > 
>>>>>>> parent of 1928b823... Merge branch 'content-browser' into tim-ui
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
