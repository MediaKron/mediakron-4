<template>
            <b-nav class="utilitynav">
                <b-nav-item href="http://mediakron.bc.edu" id="mklogo"> 
                    <img class="mediakron-logo img-fluid" :src="require('@/assets/images/MKlogo.png')" />
                    <span class="utilitynav-text">MediaKron</span>
                    </b-nav-item>
                <b-nav-item v-if="access('can create content') || access('can archive content') || access('can import')" :to="basePath + '/settings/general/'"> 
                    <font-awesome-icon icon="sliders-h"/> 
                    <span class="utilitynav-text">Settings</span>
                </b-nav-item>   
                <b-nav-item v-if="canBrowse" :to="basePath + '/menus'">
                    <font-awesome-icon icon="sitemap"/> 
                    <span class="utilitynav-text">Menus</span>
                </b-nav-item>
                <b-nav-item v-if="canBrowse" :to="basePath + '/browse'">
                    <font-awesome-icon icon="th-large"/> 
                    <span class="utilitynav-text">Content</span>
                </b-nav-item>
                <b-nav-item v-if="canBrowse && changeCount > 0" :to="basePath + '/updates'"><sup>{{ changeCount }}</sup> Changes
                </b-nav-item> 
                
                <b-nav-item :to="basePath + '/people'"><font-awesome-icon icon="user-cog"/> 
                    <span class="utilitynav-text">People</span>
                </b-nav-item>
                <b-nav-item :to="basePath + '/help'"> <font-awesome-icon icon="question-circle"/> 
                    <span class="utilitynav-text">Help</span>
                </b-nav-item>
                <b-nav-item :to="basePath + '/'" class="admin-close"> <font-awesome-icon icon="times"/> 
                    <span class="utilitynav-text">Close</span>
                </b-nav-item>   
            </b-nav>

</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
export default  Vue.extend({
    computed:{
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
    mounted(){
        
    }
});
</script>

<style>

/* needs to be unscoped */

#mklogo .mediakron-logo {
    height: 1.2em;
    border:1px solid #ccc;
    /* margin-bottom:.3em;
    margin-top:.2em; */
}

/* .utilitynav {
    text-align:center;
    background: #333;
} */

/* .utilitynav.fixed-top {
    z-index: 1029;
} */

/* .utilitynav .nav-link {
    font-size:.8rem;
    color:#fff;
} */

.utilitynav-text {
    text-transform: uppercase;
    padding-left:.5em; 
} 

/* .utilitynav .nav-link.active {
    background: #fff;
} */

/* .utilitynav .admin-close {
    margin-left:auto;
}

.utilitynav .admin-close .nav-link {
    background:#333;
}

.utilitynav .nav-link.active .utilitynav-text,
.utilitynav .nav-link.active svg {
    color:#333;
}

.utilitynav svg {
    /* font-size:1.5em; */
    /* color:#fff;  } */


/* .utilitynav {
    position:fixed;
    right:0;
    top: 0;
    width: 3.5em;
    height: 100%;
    text-align:center;
    background: #ccc;
}

.utilitynav .nav-link {
    padding: 0.5rem .2rem;
    color:#222;
}

.utilitynav-text {
    text-transform: uppercase;
    font-size: .5em;
    display:block;
    color:#222;
}

.utilitynav .nav-link.active {
    background: #f8f9fa;
}

.utilitynav .nav-link.active .utilitynav-text,
.utilitynav .nav-link.active svg {
    color:#222;
}

.utilitynav svg {
    font-size:1.5em;
    color:#222;
} */

/* add right margin on body and top nave when utility-nav is active */
  /* .utilitynav-gap {
    width: calc(100% - 3.5em);
} */

</style>
