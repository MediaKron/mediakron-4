<template>
    <div class="site-options">
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

<style>

.site-options .optionsnav {
    max-width: 18rem;
    margin:auto !important;
}

.site-options .optionsnav .nav {
    font-size: 1.8rem;
}


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
