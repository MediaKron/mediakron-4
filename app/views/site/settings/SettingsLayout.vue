<template>
    <div class="options-layout">
            <Navigation class="fixed top w-100 z-10"></Navigation>
            <div class="flex">
                <Sidebar>
                    <h2 class="bg-dark text-white mt-3 mb-3 ml-3 pb-2 text-lg uppercase">
                        <font-awesome-icon icon="cog" /> Site Options</h2>
                    <SettingsSidebar></SettingsSidebar>
                </Sidebar>
                <main role="main" id="content-wrapper"
                    class=" min-h-screen w-full mx-auto lg:static lg:max-h-full lg:overflow-visible px-6 mt-24   ">
                    <transition name="fade">
                     <router-view></router-view>
                    </transition>
                </main>
            </div>
    </div>
</template>

<script>
    import Sidebar from "@/components/Sidebar";
    import SettingsSidebar from "./SettingsSidebar";
    import Navigation from '@/views/site/Navigation'
    import {
        mapGetters
    } from 'vuex';
    export default {
        components: {
            Sidebar,
            SettingsSidebar, 
            Navigation
        },
        computed: {
            ...mapGetters('users/profile', [
                'access'
            ]),
            ...mapGetters('sites', [
                'currentSite',
                'basePath'
            ])
        }
    };
</script>

<style>
    .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    }
</style>