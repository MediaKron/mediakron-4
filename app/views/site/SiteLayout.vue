<template>
    <div id="mediakron">
        <transition  name="fade">
        <div v-if="siteIsLoading" class="d-flex is-loading">
              <b-alert show fade variant="primary" > <font-awesome-icon icon="spinner" class="loading-icon"/> Site Loading  </b-alert>
        </div>
         </transition>
        <div v-if="siteIsLoaded">
            <div id="main-container" class="utilitynav-gap">
                <navigation></navigation>
                <utilitynav v-if="currentSite && siteIsLoaded"></utilitynav>
                        
                <div id="wrapper-main">
                    <main role="main">                        
                        <router-view></router-view>
                    </main>
                </div>
                    
            </div> 
                    
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
import Navigation from './Navigation'
import Utilitynav from "./navigation/UtilityNav";
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    components:{
        Navigation,
        Utilitynav
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
#progress-bar,
#debug
 {
    display:none;
}

.is-loading {
height: 100vh;   
width: 100vw;
align-items: center;
justify-content: center;
flex-direction: column; 
background: #f5f5f5;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .75s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
