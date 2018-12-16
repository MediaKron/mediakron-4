<template>
    <div>
        <div class="home-template home-template--basic">
    
            <div class="home-template__inner">
    
                <h2 class="subtitle">{{ currentSite.subtitle }}</h2>
    
    
                <div class="home-image">
                    IMAGE here
                </div>
    
                <div class="description">{{ currentSite.description }}</div>
    
            </div>
    
            <a id="change-homepage" class="btn btn-default tooltip--w" href="/settings/homepage" data-tooltip="Change Homepage Settings">
                <span class="mk-icon mk-edit"></span>
                <span class="button-text"> Edit Homepage</span>
            </a>
    
        </div>
        <div id="homepage-content">
        </div>
    </div>
</template>

<script>
    import {
        mapActions,
        mapState,
        mapGetters
    } from 'vuex';
    export default {
        computed: {
            ...mapGetters('sites', [
                'currentSite'
            ]),
        }
    }
</script>

<style>
    
</style>
