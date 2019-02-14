<template>
    <div id="mediakron">
        <div id="main-container">
            <header id="header" role="banner">
                <div id="navbar" class="fixed pin-t pin-x z-100">
                    <mediakron-menu></mediakron-menu>
                </div>
            </header>  
                      
            <div id="wrapper-main">
                <main role="main">
                    <router-view></router-view>
                </main>
            </div>
                  
        </div> 
    </div>  
</template>

<script>
import Vue from 'vue';
import MediakronMenu from './navigation/Mediakron';
export default {
    components:{
        MediakronMenu
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

/* :root {
    --primary: #990000  ;
}

.bg-primary {
    background-color: var(--primary) !important;
} */


</style>
