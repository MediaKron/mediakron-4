<template>
    <div class="people-layout pt-4">
            <b-navbar toggleable="md" fixed="top" type="dark" class="pl-0 pr-0 py-0 z-10 w-100" variant="dark" aria-label="site menus" >
                <b-navbar-brand :to="basePath + '/options'" class="text-uppercase site-options-title ml-4"> <font-awesome-icon icon="cog" class="mr-1 ml-3"/>  Site Options</b-navbar-brand>
                <b-navbar-nav class="ml-auto">
                    <b-nav-item :to="basePath + '/'" class="admin-close ml-auto mr-2 "> 
                        <font-awesome-icon icon="times"/> 
                        <span class="utilitynav-text"> Close</span>
                    </b-nav-item>   
                </b-navbar-nav> 
            </b-navbar>
            <div class="w-full px-6">
                <div class="flex">
                    <aside id="sidebar" class="hidden min-w-64 max-w-xs lg:block pb-12">
                        <div class="lg:relative lg:sticky top-0 border-t-0 border-l-0 border-b-0 border-r-2 border-grey border-solid mr-10 pt-16 ">
                            <div class="sticky?lg:h-(screen-8) overflow-y-auto pr-4">
                                    <OptionsSidebar inPeople class="sticky?lg:h-(screen-32) overflow-y-auto "></OptionsSidebar> 
                            </div>
                        </div>  
                    </aside>
                    <main role="main" id="content-wrapper" class=" min-h-screen w-full mx-auto lg:static lg:max-h-full lg:overflow-visible px-6 mt-20"> 
                        <router-view></router-view>
                    </main>
                 </div>
            </div>
    </div>
</template>

<script>
import OptionsSidebar from "./OptionsSidebar";
import {
        mapGetters
    } from 'vuex';
export default {
    components: {
        OptionsSidebar
  },
  computed:{
        ...mapGetters('users/profile', [
            'access'
        ]),
        ...mapGetters('sites', [
            'currentSite',
            'basePath'
        ])
    }
};
</script>

<style>

</style>
