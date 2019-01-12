<template>
       <div class="homepage-settings">
        <UtilityNav></UtilityNav> 
        <div id="homepage-settings">  
            <div id="wrapper-main" class="justify-content-center sidebar-left-wrapper" >
                 <main role="main" class="sidebar-left-main" > 
                 <header>
                     <h1 class="heading-underlined"> Homepage Settings</h1>
                </header>
                <b-nav pills vertical>
                    <b-nav-item>Active</b-nav-item>
                    <b-nav-item>Link</b-nav-item>
                    <b-nav-item-dropdown id="nav7_ddown" text="Dropdown" extra-toggle-classes="nav-link-custom">
                        <b-dropdown-item>one</b-dropdown-item>
                        <b-dropdown-item>two</b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item>three</b-dropdown-item>
                    </b-nav-item-dropdown>
                     <b-nav-item>Link</b-nav-item>
                      <b-nav-item>Link</b-nav-item>
                    </b-nav>

                 </main>
             </div>
        </div>
    </div>
</template>

<script>
import UtilityNav from "./../navigation/UtilityNav";
export default {
    components: {
        UtilityNav
  }
};
</script>

<style>
</style>
