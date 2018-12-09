<template>
    <div 
        :id="id" 
        :aria-labelledby="aria" 
        role="textbox" 
        aria-multiline="false" 
        contenteditable="true" 
        class="model-field" 
        :data-placeholder="placeholder"></div>
</template>

<script>
export default {
    props: { 
        id: String, 
        aria: String,
        placeholder: String, 
        content: String
    },
    mounted: function () {
        this.$el.innerHTML = this.content;
    },
}
</script>

<style>

</style>
