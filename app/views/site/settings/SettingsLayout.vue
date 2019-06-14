<template>
    <div class="options-layout">
        <Navigation class="w-full"></Navigation>
            <b-navbar class="section-nav bg-light w-full mb-8 pb-0 pt-4">
                <b-nav class=" w-full mx-auto max-w-5xl" tabs>
                    <b-nav-item active-class="active" v-if="canBrowse" :to="basePath + '/settings/general'">
                        <font-awesome-icon icon="sliders-h" />
                        <span class="pl-2 uppercase">General</span>
                    </b-nav-item>
                    <b-nav-item class="nav-item" active-class="active" v-if="canBrowse" :to="basePath + '/settings/menus'">
                        <font-awesome-icon icon="sitemap" />
                        <span class="pl-2 uppercase">Menus</span>
                    </b-nav-item>
                    <b-nav-item active-class="active" v-if="canBrowse" :to="basePath + '/settings/appearance'">
                        <font-awesome-icon icon="paint-brush" />
                        <span class="pl-2 uppercase">Appearance</span>
                    </b-nav-item>
                    <b-nav-item active-class="active" :to="basePath + '/settings/people'">
                        <font-awesome-icon icon="user-cog" />
                        <span class="pl-2 uppercase">People</span>
                    </b-nav-item>
                    <b-nav-item active-class="active" :to="basePath + '/settings/groups'">
                        <font-awesome-icon icon="users" />
                        <span class="pl-2 uppercase">Groups</span>
                    </b-nav-item>
                </b-nav>
            </b-navbar>
            <main role="main" id="content-wrapper"
                class=" min-h-screen w-full mx-auto lg:static lg:max-h-full lg:overflow-visible px-6 mt-10  ">
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </main>
        </div>
</template>

<script>
    import Navigation from '@/views/site/Navigation'
    import {
        mapState,
        mapGetters
    } from 'vuex';
    export default {
        components: {
            Navigation
        },
        computed: {
            ...mapGetters('users/profile', [
                'user',
                'isGuest',
                'isAdmin',
                'isMember',
                'canBrowse',
                'access'
            ]),
            ...mapState('sites', [
                'currentSite'
            ]),
            ...mapGetters('sites', [
                'siteIsLoading',
                'siteIsLoaded',
                'basePath'
            ]),
            ...mapState('items', [
                'changed',
                'changeCount'
            ]),
            ...mapGetters('items', [
                'tags'
            ]),
        }
    };
</script>

<style>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter,
    .fade-leave-to

    /* .fade-leave-active below version 2.1.8 */
        {
        opacity: 0;
    }

.section-nav .nav-tabs {
        border-bottom:none;
    }

.section-nav .nav-tabs .nav-link.active, 
    .settings-nav .nav-tabs .nav-item.show .nav-link {
        border-color: #949494 #949494 #fff;
}

.section-nav .nav-tabs .nav-link:hover {
    border-color: #949494;
    background-color:#fff;
}

.section-nav {
    border-bottom: 1px solid #949494;
}


</style>