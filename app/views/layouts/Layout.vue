<template>
    <div id="mediakron">
        <div id="main-container">
            <header id="header" role="banner">
                <div id="navbar">
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
import Navigation from './Navigation'
import MediakronMenu from './navigation/Mediakron';
export default {
    components:{
        Navigation,
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
</style>
