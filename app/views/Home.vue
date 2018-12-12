<template>
<div class="container">

    <b-jumbotron header="MediaKron" lead="A Collaborative Portfolio and Curation Platform" >                          
        <b-button variant="primary" to="/help/mediakron-basics">More Info</b-button>
        <img src="@/assets/images/mklogo-horizontal-300.png" />
    </b-jumbotron>
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

</style>
