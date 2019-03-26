<template>
<div class="banner-full background-image background-image-darkened bg-cover flex flex-col items-center justify-center text-white">
    <slot></slot>
</div>
    
</template>

<script>
export default {
    
}
</script>

<style>
    .banner-full {
        height: 90vh;
    }

    .banner-full input, label {
        position:relative;
        z-index:1; /* make sure fields are visible above darkening layer */
    }

</style>

