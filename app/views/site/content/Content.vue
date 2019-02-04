<template>
<div>
    <b-navbar toggleable="md" type="dark" class="pl-0 pr-0 py-0 z-index-1 w-100" variant="primary" aria-label="site menus" >
        <b-navbar-brand class="text-uppercase site-options-title ml-4"> <font-awesome-icon icon="th-large" class="mr-1"/>  Content</b-navbar-brand>
        <b-navbar-nav class="ml-auto">
            <b-nav-item :to="basePath + '/'" class="admin-close ml-auto mr-2 ">      
                <font-awesome-icon icon="times"/> 
                <span class="utilitynav-text">Close</span>
            </b-nav-item>   
        </b-navbar-nav> 
    </b-navbar>
    <b-container class="mt-5 layout-sidebar-left ">
    <div class="row">
        <!-- <div class="sidebar-left col-md-4" >
        
        </div> -->
        <main role="main" class="with-sidebar-left col-md-12" > 
            <header>
            <h1 class="line-behind heading-nudge-up"> Content Browser</h1>
                </header>
            <!-- div v-if="items" -->
                <div v-for="item in items" v-bind:key="items.items.id">
                    <content-card :item="item"></content-card>
                </div>
            <!-- /div -->
        </main>
    </div>
    </b-container>  
</div>
</div>

</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
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
        ]),
        ...mapGetters('items', [
            'listIsLoading',
            'listLoaded',
            'items'
        ]),
        ...mapActions('items',['loadItems'])
    },
    mounted(){
         this.loadItems()
         console.log(this.items)
        
    }
});
</script>

<style>

</style>
