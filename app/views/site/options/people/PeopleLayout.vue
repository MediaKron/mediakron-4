<template>
    <div class="people-layout pt-4">
        <UtilityNav></UtilityNav> 
            <div class="w-full px-6">
                <div class="flex">
                    <aside id="sidebar" class="hidden min-w-64 max-w-xs lg:block pb-12">
                        <div class="lg:relative lg:sticky pin-t border-t-0 border-l-0 border-b-0 border-r-2 border-grey border-solid mr-10 pt-16 ">
                            <div class="sticky?lg:h-(screen-8) overflow-y-auto pr-4">
                                    <OptionsNav inPeople class="sticky?lg:h-(screen-32) overflow-y-auto "></OptionsNav> 
                            </div>
                        </div>  
                    </aside>
                    <main role="main" id="content-wrapper" class=" min-h-screen w-full max-w-2xl mx-auto lg:static lg:max-h-full lg:overflow-visible px-6 mt-20"> 
                        <b-nav class="mb-4 options-sectionnav line-behind">
                            <b-nav-item :to="{ name: 'people_list' }">Users</b-nav-item>
                            <b-nav-item :to="{ name: 'groups' }">Groups</b-nav-item>
                        </b-nav>
                        <router-view></router-view>
                    </main>
                 </div>
            </div>
    </div>
</template>

<script>
import UtilityNav from "./../../navigation/UtilityNav";
import OptionsNav from "./../../navigation/OptionsNav";
import {
        mapGetters
    } from 'vuex';
export default {
    components: {
        UtilityNav,
        OptionsNav
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
