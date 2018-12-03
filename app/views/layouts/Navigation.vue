<template>
    <header id="header" role="banner">
        <div id="root-nav" v-if="!current">
            <mediakron-menu></mediakron-menu>
        </div>
        <div v-if="current && isLoaded" id="navbar">
            <button type="button" class="mobile-nav-button mobile-nav-close"><span class="mk-icon mk-close"></span></button>
            <nav id="nav-main" role="navigaton" aria-label="Main Navigation">
                <!-- Main Menu will get loaded here -->
            </nav>
            <nav id="nav-secondary" role="navigaton" aria-label="Secondary Navigation">                       
                <!-- Navbar Right Goes Here -->
            </nav>
        </div>
        <div id="branding">
            <button type="button" class="mobile-nav-button"><span class="mk-icon mk-menu"></span></button>
            <span id="site-logo"></span>
            <span id="site-name"></span>
            <h1 class="page-header"><span id="site-name"><a href="home"></a></span></h1>
            <span id="institution-logo"></span>
        </div>
    </header>  
</template>

<script>
import Vue from 'vue';
import { mapActions, mapState, mapGetters } from 'vuex';
import MediakronMenu from './navigation/Mediakron';
import Primary from './navigation/Primary';
import Secondary from './navigation/Secondary';
export default Vue.extend({
    components:{
        MediakronMenu,
        Primary,
        Secondary
    },
    computed:{
        ...mapState('sites', [
            'current'
        ]),
        ...mapGetters('sites', [
            'isLoading',
            'isLoaded'
        ])
    }
});
</script>

<style>

</style>
