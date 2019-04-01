<template>
    <div class="options-layout">
        <div class="w-full">
            <div class="flex">
                <Sidebar>
                    <h2 class="bg-dark text-white mt-3 mr-12 mb-3 ml-3 pb-2 text-lg uppercase">
                        <font-awesome-icon icon="cog" /> Site Options</h2>
                    <OptionsSidebar></OptionsSidebar>
                    <b-button variant="link" :to="basePath + '/'"
                        class="bg-white text-black fixed top-0 right-0 ml-auto uppercase flex flex-column content-center justify-center rounded-none mt-3 mr-3">
                        <font-awesome-icon icon="times" class="w-auto text-2xl" />
                        <span class="text-xs"> Close</span>
                    </b-button>
                </Sidebar>
                <main role="main" id="content-wrapper"
                    class=" min-h-screen w-full mx-auto lg:static lg:max-h-full lg:overflow-visible px-6 mt-16   ">
                    <router-view></router-view>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
    import Sidebar from "@/components/Sidebar";
    import OptionsSidebar from "./OptionsSidebar";
    import {
        mapGetters
    } from 'vuex';
    export default {
        components: {
            Sidebar,
            OptionsSidebar
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

</style>