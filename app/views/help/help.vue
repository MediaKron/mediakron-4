<template>
    <div class="help">
        <b-button variant="link" :to="basePath + '/'"
            class="bg-white text-black fixed top-0 right-0 ml-auto uppercase flex flex-column content-center justify-center rounded-none mt-3 mr-3">
            <font-awesome-icon icon="times" class="w-auto text-2xl" />
            <span class="text-xs"> Close</span>
        </b-button>
        <main role="main" class="w-100 max-w-2xl mx-auto mt-16">
            <header>
                <h1 class="line-behind heading-nudge-up mb-4"> Ways to Get Help </h1>
            </header>

            <h2>MediaKron Support</h2>
            <b-list-group class="mb-5">
                <b-list-group-item href="mailto:mediakron@bc.edu">Email mediakron@bc.edu</b-list-group-item>
                <b-list-group-item href="/help">Visit Support</b-list-group-item>
            </b-list-group>

            <h2>Help Categories</h2>
            <b-list-group class="mb-5">
                <b-list-group-item :to="basePath + '/help/mediakron-basics'">About MediaKron</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/working-with-content'">Working with Content</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/mediakron-basics'">Administering Your Site</b-list-group-item>
            </b-list-group>

            <h2>For content creators</h2>
            <b-list-group class="mb-5">
                <b-list-group-item :to="basePath + '/help/working-with-content/content-types/stories-overview'">Working
                    with stories</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/working-with-content/content-types/folder-overview'">Working
                    with folders</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/working-with-content/content-types/map-overview'">Working
                    with maps</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/working-with-content/content-types/timeline-overview'">Working
                    with timelines</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/working-with-content/content-types'">Other content
                    types</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/working-with-content/revisions'">Recovering previous
                    versions</b-list-group-item>
            </b-list-group>
            <h2>For Site Administrators</h2>
            <b-list-group class="mb-5">
                <b-list-group-item :to="basePath + '/help/site-administration/managing-users'">Adding users or
                    classes to a site</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/site-administration/hompage-overview'">Customizing
                    the homepage</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/site-administration/menu-overview'">Adding Menus</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/site-administration/site-appearance'">Changing site
                    colors/logo</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/site-administration/mediakron-to-canvas-overview'">Integrating
                    MediaKron with Canvas</b-list-group-item>
            </b-list-group>
        </main>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        mapState,
        mapGetters
    } from 'vuex';
    export default Vue.extend({
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
        },
        mounted() {

        }
    });
</script>

<style>
    .profile .sidebar-left ul {
        max-width: 12rem;
    }
</style>