<template>
<div>
    <ul class="secondary-menu" role="navigation">

        <li v-if="canBrowse" class="level-1 browse-menu">
            <a href="/browse" title="Browse All Site Content"><span class="mk-icon mk-grid level-1"></span><span class="link-text"> Browse</span> </a>
        </li>  

        <li v-if="canBrowse && changeCount > 0" class="level-1 updates-menu">
            <a href="/updates"><span class="mk-icon mk-updates level-1"></span><sup>{{ changeCount }}</sup><span class="update-text link-text">Changes </span> </a>          
        </li>

        <li v-if="currentSite.tags && tags.length > 0" id="tags" class="level-1">
            <a href="/tags" class="tags-menu"><span class="mk-icon mk-tag level-1"></span><span class="link-text"> Tags</span></a>
        </li>
            
        <li v-if="currentSite.search" id="search" class="level-1">
            <button class="toggle-search btn-no-style" aria-label="Search Button"><span class="mk-icon mk-search level-1"></span><span class="link-text"> Search</span></button>
        </li>

            
        <li v-if="access('can create content')" class="level-1 add-content-button nav-left">
                <a href="settings/content/add" title="Add Content"><span class="mk-icon mk-add level-1"></span><span class="link-text">Add</span>  
                </a>
        </li>
        

        <li v-if="access('can create content')" class="level-1 add-content-button nav-top ">
            <a href="settings/content/add" title="Add Content"><span class="mk-icon mk-add level-1"></span><span class="link-text">Add</span>  
            </a>
        </li>


        <li v-if="access('can create content') || access('can archive content') || access('can import')" id="settings-button" class="level-1">
            <a href="/settings"><span class="mk-icon mk-settings level-1"></span><span class="link-text" >Settings</span></a>
        </li>

        <li v-if="isGuest" id="user" class="level-1">
            <button class="btn-no-style open-modal"><span class="mk-icon mk-user level-1"></span><span class="link-text"> User</span></button>

            <ul class="modal-content dropdown-container" data-visually-hidden="true">

                <li class="modal-title dropdown-title">
                    <span class="mk-icon mk-user"></span> User Information
                </li> 
            
                <li v-if="!isGuest" class="dropdown-item user-details"> 
                    {{ user.name }} <span class="user-role">Role: {{ user.role }}</span>
                </li> 
            
                <li class="close-modal">
                    <button class="btn btn-sm btn-default" aria-label="Close">
                        <span class="mk-icon mk-close"></span>
                        <span class="button-text sr-only"> Close</span> 
                    </button>
                </li>
            
                <li class="dropdown-item  my-content-menu">
                    <a href="/mycontent" ><span class="mk-icon mk-grid"></span><span> My Content</span></a>
                </li> 

                <li class="dropdown-item ">
                    <a href="redirect/profile"><span class="mk-icon mk-tools"></span> My Account</a>
                </li>

                <li v-if="access('can change site settings')" class="dropdown-item ">
                    <a href="/settings/users" class=""> <span class="mk-icon mk-settings"></span> Manage All Users</a>
                </li>  

                <li v-if="!isGuest" class="dropdown-item ">
                    <a href="/redirect/logout" class=""> <span class="mk-icon mk-unpublish"></span> Sign Out </a>
                </li>
            </ul>        
        </li>

        <li v-if="currentSite.user && isGuest"  id="settings-button" class="level-1">
            <a href="/login" title="Log into this site"><span class="mk-icon mk-user" ></span><span class="link-text"> Login</span></a>
        </li>


        

        <li v-if="!isGuest" id="help-menu" class="level-1">
            <button class="btn-no-style open-modal"  aria-label="Help Button">
                <span class="mk-icon mk-help level-1"></span><span class="link-text"> Help</span>
            </button>
            <ul class="modal-content dropdown-container" data-visually-hidden="true">

                <li class="modal-title dropdown-title">
                    <span class="mk-icon mk-help"></span> MediaKron Support
                </li>

                <li class="close-modal">
                    <button class="btn btn-sm btn-default" aria-label="Close">
                        <span class="mk-icon mk-close"></span>
                        <span class="button-text sr-only"> Close</span> 
                    </button>
                </li>

                <li class="dropdown-item email-support">
                    <a href="mailto:mediakron@bc.edu"><span class="mk-icon mk-mail"></span> Email mediakron@bc.edu</a>
                </li>

                <li class="dropdown-item ">
                    <a href="http://mediakron.bc.edu/help"><span class="mk-icon mk-info"></span> Visit Support Site</a>
                </li>
                
                <li class="dropdown-item dropdown-header">
                    Help Categories
                    <ul>
                        <li>
                            <a href="http://tmkp2.bc.edu/help/mediakron-basics">About MediaKron</a>
                        </li>
                        <li>
                            <a href="https://mediakron.bc.edu/help/working-with-content">Working with Content</a>
                        </li>
                        <li>
                            <a href="https://mediakron.bc.edu/help/site-administration">Administering Your Site</a>
                        </li>
                    </ul>
                </li>
            
                <li class="dropdown-item dropdown-header">
                    For Content Editors
                    <ul>
                        <li>
                            <a href="https://mediakron.bc.edu/help/working-with-content/content-types/stories-overview">Working with stories</a>
                        </li>
                        <li>
                            <a href="https://mediakron.bc.edu/help/working-with-content/content-types/folder-overview">Working with folders</a>
                        </li>
                        <li>
                            <a href="https://mediakron.bc.edu/help/working-with-content/content-types/map-overview">Working with maps</a>
                        </li>
                        <li>
                            <a href="https://mediakron.bc.edu/help/working-with-content/content-types/timeline-overview">Working with timelines</a>
                        </li>
                        <li>
                            <a href="https://mediakron.bc.edu/help/working-with-content/content-types">Other content types</a>
                        </li>
                        <li>
                            <a href="https://mediakron.bc.edu/help/working-with-content/revisions">Recovering previous versions</a>
                        </li>
                    </ul>
                </li>
            
                <li class="dropdown-item dropdown-header">
                    For Site Administrators
                    <ul>
                        <li>
                            <a href="https://mediakron.bc.edu/help/site-administration/managing-users">Adding users or classes to a site</a>
                        </li>
                        <li>
                            <a href="https://mediakron.bc.edu/help/site-administration/hompage-overview">Customizing the homepage</a>
                        </li>
                        <li>
                            <a href="https://mediakron.bc.edu/help/site-administration/menu-overview">Adding Menus</a>
                        </li>
                        <li>
                            <a href="https://mediakron.bc.edu/help/site-administration/site-appearance">Changing site colors/logo</a>
                        </li>
                        <li>
                            <a href="http://tmkp2.bc.edu/help/site-administration/mediakron-to-canvas-overview">Integrating MediaKron with Canvas</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>

        <li v-if="fullscreen" id="full-screen-menu" class="level-1">
            <button id="full-screen" title="Full screen On/Off">
                <span class="mk-icon mk-fullscreen-open level-1" ></span>
                <span class="link-text"> Full </span>
                
            </button>
        </li>

        <li v-if="logo" id="mk-logo-menu" class="level=1">
            <a href="http://mediakron.bc.edu" class="tooltip--sw" data-tooltip="About MediaKron">
            <img id="mediakron-logo" src="/images/MKlogo.png" alt="MediaKron Logo"></a>
        </li>
    </ul>

    <div class="menu-bg"></div>
</div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
export default Vue.extend({
    data(){
        return {
            basepath: '',
            secondary: ''
        }
    },
    computed:{
        ...mapGetters('profile', [
            'isGuest',
            'isAdmin',
            'isMember',
            'canBrowse'

        ]),
        ...mapState('sites', [
            'currentSite'
        ]),
        ...mapState('items', [
            'changed',
            'changeCount'
        ]),
        ...mapGetters('items', [
            'tags'
        ]),
    }

});
</script>

<style>

</style>
