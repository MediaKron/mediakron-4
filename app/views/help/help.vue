        <template>
<div class="profile">
        <b-navbar toggleable="md" type="dark" class="pl-0 pr-0 py-0 z-index-1 w-100" variant="dark" aria-label="site menus" >
    <b-navbar-brand class="text-uppercase site-options-title ml-4"> <font-awesome-icon icon="question-circle" class="mr-1"/>  Help</b-navbar-brand>
     <b-navbar-nav class="ml-auto">
        <b-nav-item :to="basePath + '/'" class="admin-close ml-auto mr-2 "> 
            <font-awesome-icon icon="times"/> 
            <span class="utilitynav-text"> Close</span>
        </b-nav-item>   
    </b-navbar-nav> 
</b-navbar>
<b-container class="mt-5 layout-sidebar-left ">

    <div class="row">
                <!-- <div class="sidebar-left col-md-4" >
                
                </div> -->
                <main role="main" class="with-sidebar-left col-md-8" > 
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
                <b-list-group-item :to="basePath + '/help/working-with-content/content-types/stories-overview'">Working with stories</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/working-with-content/content-types/folder-overview'">Working with folders</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/working-with-content/content-types/map-overview'">Working with maps</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/working-with-content/content-types/timeline-overview'">Working with timelines</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/working-with-content/content-types'">Other content types</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/working-with-content/revisions'">Recovering previous versions</b-list-group-item>
              </b-list-group>   
             <h2>For Site Administrators</h2>
             <b-list-group  class="mb-5">
                <b-list-group-item :to="basePath + '/help/site-administration/managing-users'">Adding users or classes to a site</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/site-administration/hompage-overview'">Customizing the homepage</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/site-administration/menu-overview'">Adding Menus</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/site-administration/site-appearance'">Changing site colors/logo</b-list-group-item>
                <b-list-group-item :to="basePath + '/help/site-administration/mediakron-to-canvas-overview'">Integrating MediaKron with Canvas</b-list-group-item>
            </b-list-group>         
                </main>
    </div>
 </b-container>   
</div>
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

.profile .sidebar-left ul {
 max-width: 12rem;
}

</style>

        
        
       