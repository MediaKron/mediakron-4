<template>
    <div>
        <div class="container flex flex-col items-center">

            <h1 class="mt-12"> <span class="sr-only"> Site Homepage:</span>{{ currentSite.title }}</h1>

            <h2 class="">{{ currentSite.subtitle }}</h2>

            <div class="home-image">
                <b-img src="https://picsum.photos/1000/1000/?random" fluid alt="Responsive image" />
            </div>

            <div class="max-w-md mt-4" v-html="currentSite.description"></div>
    
         </div>

        <div id="homepage-content"> </div>

        <b-button v-if="!isEditing" class="fixed pin-t pin-r mt-16 mr-8" variant="primary" @click="editClicked"> Edit Homepage</b-button>  
         
    </div>
</template>

<script>
    import {
        mapActions,
        mapState,
        mapGetters
    } from 'vuex';
    export default {
        computed: {
            ...mapGetters('sites', [
                'currentSite'
            ]),
        }
    }
</script>

<style>
    
</style>
