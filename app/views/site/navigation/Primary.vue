<template>
    <div>
        <ul class="main-menu" role="navigation" aria-label="Main menu">
            <li v-if="!hasItems && access('can change site settings')" class="add-menu-navbar no-menus">
                <a href="/settings/navigation"> Add Menus </a>
            </li>
            <li>
    
                <button v-if="hasItems" type="button" id="menu-toggle" class="js-menu-trigger btn-no-style">
                    <span class="mk-icon mk-menu"></span> Menu
                </button>
    
                <ul class="js-menu main-menu-sidebar">
                    <li class="home-link menu-item">
                        <a href="/" class="contrast-tint">Home</a>
                    </li>
    
                    <li v-for="item in items" v-bind:key="item.id" class="menu-item">
                        <a :href="item.uri">{{ item.title }}</a>
                    </li>
    
                    <li v-if="access('can change site settings')" class="add-menu-navbar menu-item">
                        <a href="#settings/navigation">
                            <span class="mk-icon mk-edit"></span> Edit Menus
                        </a>
                    </li>
    
                    <li class="close-button">
                        <button><span class="mk-icon mk-close"></span></button>
                    </li>
                </ul>
    
            </li>
        </ul>
        <div class="js-menu-screen sliding-menu-fade-screen"></div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        mapGetters
    } from 'vuex';
    export default Vue.extend({
        computed: {
            hasItems() {
                return this.items.length > 0;
            },
            items() {
                return this.currentSite.menu;
            },
            ...mapGetters('sites', [
                'currentSite',
                'currentIsLoaded'
            ]),
            ...mapGetters('profile', [
                'isGuest',
                'isAdmin',
                'access'
            ])
        }
    });
</script>

<style>
    
</style>
