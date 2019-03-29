<template>
    <div class="options-layout">
            <div class="w-full">
                        
                <div class="flex">
                    <aside id="sidebar" class="hidden max-w-xs lg:block pb-12 pl-2 bg-dark">
                        <div class="bg-dark text-white mt-3 mr-12 mb-0 ml-4 pb-2 uppercase text-lg border-t-0 border-l-0 border-b-1 border-r-0 border-gray-100 border-solid"><font-awesome-icon icon="cog"/>  Site Options</div>
                        <b-button variant="link" :to="basePath + '/'" class="bg-white text-black fixed top-0 right-0 ml-auto uppercase flex flex-column content-center justify-center rounded-none mt-3 mr-3"> 
                            <font-awesome-icon icon="times" class="w-auto text-2xl"/> 
                            <span class="text-xs"> Close</span>
                         </b-button>   
                        <div class="lg:relative lg:sticky top-0 pt-2 pl-2 ">
                            <div class="sticky?lg:h-(screen-8) overflow-y-auto">
                                    <OptionsSidebar inPeople class="sticky?lg:h-(screen-32) overflow-y-auto "></OptionsSidebar> 
                            </div>
                        </div>  
                    </aside>
                    <main role="main" id="content-wrapper" class=" min-h-screen w-full mx-auto lg:static lg:max-h-full lg:overflow-visible px-6 mt-16   "> 
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
