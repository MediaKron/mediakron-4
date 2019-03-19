<template>
 <div class="homepage-layout">
        <navigation></navigation> 
        <div id="homepage container">         
            <div id="wrapper-main" class="justify-content-center row" >
                 <main role="main" > 
                    
                    <component :is="dynamicComponent"></component>
                 </main>
             </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import Basic from './layouts/Basic';
import Full from './layouts/Full';
import Half from './layouts/Half';
import Navigation from './../Navigation';
//
export default {
   components: {
        Basic,
        Full,
        Half,
        Navigation
   },
   computed: {
       dynamicComponent(){
            switch(this.template){
                case 'full':
                    return 'full';
                case 'basic':
                    return 'basic';
                default:
                    return 'basic';
           }
           
       },
       template(){
           console.log(this.currentSite.layout)
           return this.currentSite.layout;
       },
       ...mapGetters('sites', [
           'currentSite'
       ]),
       /*...mapGetters('items', [
           'currentItem'
       ]),*/
   }
}
</script>

<style>

</style>
