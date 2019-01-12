<template>
    <div class="people-layout">
        <UtilityNav></UtilityNav> 
        <div id="people">  
              <div class="sidebar-left" >
                <div v-if="access('can change site siteadmin')" class="sidebar-sticky">
                    <div v-if="access('can change site siteadmin')">
                        <b-nav pills vertical class="pb-2 px-3 ">
                            <h4 class="sidebar-heading"><font-awesome-icon icon=""/> Users</h4>  

                            <b-nav vertical pills>
                            <b-nav-item :to="basePath + '/users/general'">List</b-nav-item>
                            <b-nav-item :to="basePath + '/users/add'">Add People</b-nav-item>
                            <b-nav-item :to="basePath + '/users/groups'">Groups</b-nav-item>
                            </b-nav>  
                        </b-nav>  
                    </div>
                </div>
            </div>  
            <div id="wrapper-main" class="justify-content-center sidebar-left-wrapper" >
                 <main role="main" class="sidebar-left-main" > 
                     <transition name="fade">
                            <router-view></router-view>
                     </transition>
                 </main>
             </div>
        </div>
    </div>
</template>

<script>
import UtilityNav from "./../navigation/UtilityNav";
import {
        mapGetters, mapActions
    } from 'vuex';
export default {
    components: {
        UtilityNav
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
