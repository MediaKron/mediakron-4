<template>
<div class="search">
        <b-navbar toggleable="md" type="dark" class="pl-0 pr-0 py-0 z-index-1 w-100" variant="primary" aria-label="site menus" >
    <b-navbar-brand class="text-uppercase site-options-title ml-4"> <font-awesome-icon icon="search" class="mr-1"/>  Search</b-navbar-brand>
     <b-navbar-nav class="ml-auto">
        <b-nav-item :to="basePath + '/'" class="admin-close ml-auto mr-2 "> 
            <font-awesome-icon icon="times"/> 
            <span class="utilitynav-text">Close</span>
        </b-nav-item>   
    </b-navbar-nav> 
</b-navbar>
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
export default  Vue.extend({
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
