<template>
    <div>
        This is my home page
        <div class="col-lg-12 section about-section">
            <p class="lead section-lead">
                <strong>Mediakron is an online toolkit for digital curation and storytelling.</strong> 
                <br>It makes it easy to collect and organize content in flexible ways using 
                slideshows, maps, timelines, narratives, comparisons, annotations, and more.
            </p>
            <text-field label="My Field" placeholder="Enter some text" help="helptext"></text-field>
            <text-field label="My Field 2" placeholder="Enter some more text"></text-field>  
            <rich-text></rich-text>
        </div>


    </div>
</template>
 
<script>
import TextField from "@/components/forms/TextField";
import RichText from "@/components/forms/RichText";
export default {
    components:{
        TextField,
        RichText
    }
}
</script>

<style>

</style>
