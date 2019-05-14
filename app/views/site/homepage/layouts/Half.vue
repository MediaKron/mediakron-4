<template>
    <div>
        <div class="w-full flex flex-col items-center">

             <m-banner-half class="w-full" style="background-image: url('https://picsum.photos/1000/1000/?random')">
                <h1 class="mt-12"> <span class="sr-only"> Site Homepage:</span>{{ currentSite.title }}</h1>
                <h2 class="">{{ currentSite.subtitle }}</h2>
            </m-banner-half>

            <div class="max-w-md mt-4" v-html="currentSite.description"></div>
    
         </div>

        <div id="homepage-content"> </div>

        <b-button class="fixed top-0 right-0 mt-16 mr-8 bg-white hover:text-black" variant="outline-dark" :to="basePath + '/homesettings'"><font-awesome-icon icon="edit" />  Edit Homepage</b-button>  
         
    </div>
</template>

<script>

import { mapActions, mapState, mapGetters } from 'vuex';
    import MBannerHalf from '@/components/banners/BannerHalf'
    export default {
        components: {
            MBannerHalf
        },
        computed: {
            ...mapGetters('sites', [
                'currentSite',
                 'basePath'
            ]),
        }
    }
</script>

<style>
    
</style>
