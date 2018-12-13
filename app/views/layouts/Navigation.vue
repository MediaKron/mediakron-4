<template>
    <header id="header" role="banner">
        <div id="navbar">
            <nav v-if="currentSite && siteIsLoaded" id="nav-main" role="navigaton" aria-label="Main Navigation">
                <primary></primary>
            </nav>
            <nav  id="nav-secondary" role="navigaton" aria-label="Secondary Navigation">      
                site is loaded               
                <secondary></secondary>
            </nav>
        </div>
        <div id="branding">
            <span id="site-logo"></span>
            <span id="site-name"></span>
            <h1 class="page-header"><span id="site-name">
                <a href="home">
                    {{ currentSite.title }}
                </a>
            </span></h1>
            <span id="institution-logo"></span>
        </div>
    </header>  
</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import Primary from './navigation/Primary';
import Secondary from './navigation/Secondary';
export default Vue.extend({
    components:{
        Primary,
        Secondary
    },
    computed:{
        ...mapState('sites', [
            'currentSite'
        ]),
        ...mapGetters('sites', [
            'siteIsLoading',
            'siteIsLoaded'
        ])
    }
});
</script>

<style scoped lang="scss">
    header{
        background:black;
        #branding{
            display:block;
        }
        #site-name{
            display: inline-block;
            padding-top: 0.3125rem;
            padding-bottom: 0.3125rem;
            margin-right: 1rem;
            font-size: 1.25rem;
            line-height: inherit;
            white-space: nowrap;
            a{
                color:#fff;
            }
        }
    }
</style>
