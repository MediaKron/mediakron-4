<template>
 <div class="homepage-layout">
        <navigation></navigation> 
        <div id="homepage">         
            <div id="wrapper-main" class="justify-content-center" >
                 <main role="main" > 
                     <transition name="fade">
                            <h1 class="mt-5"> Site Homepage </h1>
                         <component :is="dynamicComponent"></component>
                     </transition>
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
