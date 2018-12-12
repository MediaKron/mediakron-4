<template>
    <div class="home-container background-image background-image-darkened" style="background-image: url(https://mediakron.bc.edu/files/help/styles/double/public/help_6uDmgd.jpg);">
        <img src="@/assets/images/mk-banner-white.png" />
        <h1 class="home-title text-uppercase sr-only">MediaKron</h1>
        <h2 class="subtitle">A Collaborative Portfolio and Curation Platform</h2>

    </div>
</template>
 
<script>
import TextField from "@/components/controls/TextField";
import RichText from "@/components/controls/RichText";
export default {
    components:{
        TextField,
        RichText
    }
}
</script>

<style>

.home-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    align-items: center;
    justify-content: center;    
    color: #fff;
}

h1, 
.subtitle {
    position:relative;
    z-index:2;
}

.home-title {
    font-size: 7vw;
}

.subtitle {
    font-size: 3vw;
}

#branding {
    display:none;
}

</style>
