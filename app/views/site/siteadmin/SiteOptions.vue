<template>
    <div class="site-options pt-5">
        <UtilityNav class="hide-menus"></UtilityNav> 
        <div id="site-settings">      
            <div id="wrapper-main" class="justify-content-center" >
                 <main role="main" class="container mt-4" > 
                    <OptionsNav></OptionsNav> 
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

<style scss>

.site-options .optionsnav {
    max-width: 28rem;
    margin:auto !important;
}

.site-options .optionsnav .nav {
    font-size: 1.8rem;
}

.site-options .optionsnav .nav-link {
  display: flex;
  align-items: center;
  color: #000;
}

.site-options .optionsnav .nav-link svg {
  display: flex;
  align-items: center;
  color: var(--primary);
}

.site-options .optionsnav .nav-link::after {
  content: "";
  height: .5rem;
  flex: 1 1 auto;
  margin-left: 1rem;
  background-color: var(--primary);
  position:relative;
  top:.1rem;
} 


.site-options h2{
    font-size: 1.5rem;
    margin-bottom:0;
}



.fade-enter-active  {
  transition: opacity .5s;
}
.fade-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
