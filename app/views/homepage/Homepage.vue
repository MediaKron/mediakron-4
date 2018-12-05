<template>
    <component :is="dynamicComponent" :item="currentItem"></component>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import Full from './layouts/Full';
import Half from './layouts/Half';
export default {
   components: {
       Full
   },
   computed: {
       dynamicComponent(){
           switch(this.template){
               case 'full':
                 return 'full';
           }
           
       },
       template(){
           return this.currentItem.templete;
       },
       ...mapGetters('items', [
           'currentItem'
       ]),
   }
}
</script>

<style>

</style>
