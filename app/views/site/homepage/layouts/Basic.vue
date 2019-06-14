<template>
    <div>
        <div class="container flex flex-col items-center">

            <h1 class="mt-12"> <span class="sr-only"> Site Homepage:</span>{{ currentSite.title }}</h1>

            <h2 class="">{{ currentSite.subtitle }}</h2>

            {{ currentSite.layout }}

            <div class="home-image">
                <b-img src="https://picsum.photos/1000/1000/?random" fluid alt="Responsive image" />
            </div>

            <div class="max-w-md mt-4" v-html="currentSite.description"></div>
    
         </div>

        <div id="homepage-content"> </div>

         <b-button class="fixed top-0 right-0 mt-16 mr-8 bg-white hover:text-black" variant="outline-dark" :to="basePath + '/homesettings'"><font-awesome-icon icon="edit"/> Edit Homepage</b-button>  
   
       
         
    </div>
</template>

<script>
import editable from '~/components/mixins/editable';
import data from '@/components/mixins/data';
import {
        mapActions,
        mapState,
        mapGetters
    } from 'vuex';
export default {
    mixins: [ editable ],
    computed: {
        ...mapGetters('sites', [
            'currentSite', 'basePath'
        ]),
        ...mapGetters('items', [
            'isEditing'
        ]),
    },
}
</script>

<style>
    
</style>
