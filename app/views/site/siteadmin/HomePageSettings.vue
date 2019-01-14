<template>
       <div class="homepage-settings">
        <UtilityNav></UtilityNav> 
        <div id="appearance" class="layout-sidebar-left mt-5 container">  
            <div class="row">
                <div class="sidebar-left col-md-4" >
                        <OptionsNav inHomepage></OptionsNav> 
                </div>
                <main role="main" class="with-sidebar-left col-md-8" > 
                 <header>
                     <h1 class="line-behind heading-nudge-up mb-4"> Homepage Settings</h1>
                </header>
                

                 </main>
             </div>
        </div>
    </div>
</template>

<script>
import UtilityNav from "./../navigation/UtilityNav";
import OptionsNav from "./../navigation/OptionsNav";
export default {
    components: {
        UtilityNav,
        OptionsNav
  }
};
</script>

<style>
</style>
