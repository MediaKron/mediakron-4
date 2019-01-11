<template>
    <div class="site-options">
        <UtilityNav class="hide-menus"></UtilityNav> 
        <div id="site-settings">      
            <div id="wrapper-main" class="justify-content-center" >
                 <main role="main" class="container mt-4" > 
                     <b-card-group deck>
                        <b-card no-body>
                            <div class="card-header bg-dark">
                                    <h2 class="text-center text-uppercase"> <b-link :to="basePath + '/settings/general/'" class="text-white"><font-awesome-icon icon='sliders-h'/> Settings</b-link></h2>
                            </div>
                             <b-card-body>
                        Quis magna Lorem anim amet ipsum do mollit sit cillum voluptate ex
                        nulla tempor. 
                         </b-card-body>
                            <b-card-body class="text-center">
                                <b-button href="#" variant="primary" class="mb-1">General</b-button>
                                <b-button href="#" variant="primary" class="mb-1" >Search Settings</b-button>
                                <b-button href="#" variant="primary">Canvas</b-button>
                            </b-card-body>
                       </b-card>
                        <b-card no-body>
                                <div class="card-header bg-dark">
                                    <h2 class=" text-center text-uppercase"> <b-link :to="basePath + '/settings/menus/'" class="text-white"><font-awesome-icon icon='sitemap'/> Menus</b-link></h2>
                                 </div>
    
                                <b-list-group flush>
                                    <b-list-group-item>Manage</b-list-group-item>
                                    <b-list-group-item>Appearance</b-list-group-item>
                                </b-list-group>
                             
                        </b-card>
                         <b-card no-body>
                                <div class="card-header bg-dark">
                                    <h2 class=" text-center text-uppercase"> <b-link :to="basePath + '/settings/general/'" class="text-white"><font-awesome-icon icon='paint-brush'/> Appearance</b-link></h2>
                                  </div>  
                                
                             
                        </b-card>

                        <b-card no-body >
                        <div class="card-header bg-dark text-white">
                        <font-awesome-icon icon='sliders-h'/>SEttings
                    </div>
                        <b-list-group flush tag="ul">
                        <b-list-group-item tag="li"> <b-link href="#foo">Link</b-link></b-list-group-item>
                        <b-list-group-item  tag="li"> <b-link href="#foo">Link</b-link></b-list-group-item>
                        <b-list-group-item href="#"> asdfasddfs</b-link></b-list-group-item>
                        </b-list-group>
                       
  </b-card>
                    </b-card-group>
                 </main>
             </div>
        </div>
    </div>
</template>

<script>
import SettingsNav from "./SettingsNav.vue";
import UtilityNav from "./../navigation/UtilityNav";
export default {
    components: {
        SettingsNav,
        UtilityNav
  }
};
</script>

<style>

.site-options h2{
    font-size: 1.5rem;
    margin-bottom:0;
}

.card-svg-top {
    display:flex;
    height: 4rem;
    background: #ccc;
    padding: .5em 0;
    width:100%;
    align-content: center;
    justify-content: center;
}

.card-svg-top svg {
    font-size:3rem;
}

.fade-enter-active  {
  transition: opacity .5s;
}
.fade-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
