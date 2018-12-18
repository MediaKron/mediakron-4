<template>
    <div id="mediakron">
        <div v-if="siteIsLoading">
            Site Loading
        </div>
        <div v-if="siteIsLoaded">
            <div id="main-container">
                <navigation></navigation>
                        
                <div id="wrapper-main">
                    <main role="main">                        
                        <router-view></router-view>
                    </main>
                </div>
                    
            </div> 
                    
            <section id="settings-context" class="closed settings-pane">
                <router-view name="settings"></router-view>
            </section>
                    
            <div id="help-context" class="closed help-pane">
                <div id="help-contents" class="overlay overlay-sidebar">
                    <router-view name="help"></router-view>
                </div>
                <div class="overlay-bg"></div>
            </div>
                    
            <div id="linkbrowser-context" class="closed linkbrowser-pane ">
                <div id="linkbrowser-contents"></div>
            </div>
                    
            <button type="button" class="scroll-arrow btn-no-style scroll-top">
                <span class="mk-icon mk-arrow-up"></span>
                <span class="sr-only">To Top</span>
            </button>
                    
            <button type="button" class="fullscreen-nav-toggle"><span class="mk-icon mk-menu"></span></button>
            
            <div id="pastehelper" contenteditable=true>PASTE HELPER</div>
                    
            <div id="progress-bar" class="site-loader">
                <div class="progress active">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
                <div id="progress-text"></div>
            </div>
                    
            <div id="messages">
                <div id="message-top"></div>
                <div id="message-center"></div>
                <div id="message-left"></div>
                <div id="message-right"></div>
                <div id="message-bottom"></div>
            </div>
                    
            <div class="js-screen fade-screen"></div>
                    
            <div id="debug" class="hide">
                <h2>Mediakron Debugging</h2> 
            </div>

            <div id="online-status"></div>
        </div>
    </div>  
</template>

<script>
import Vue from 'vue';
import Navigation from './Navigation'
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    components:{
        Navigation
    },
    props:['site'],
    computed:{
        ...mapState('sites', [
            'currentSite'
        ]),
        ...mapGetters('sites', [
            'siteIsLoaded',
            'siteIsLoading'
        ])
    },
    methods:{
        ...mapActions('sites', [
            'getSite'
        ])
    },
    mounted(){
        this.getSite(this.site);
    }

}
</script>

<style>
.scroll-arrow,
.fullscreen-nav-toggle,
#pastehelper,
#progress-bar
 {
    display:none;
}
</style>
