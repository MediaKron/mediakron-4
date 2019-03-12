<template>
<div class="banner-half background-image background-image-darkened bg-cover flex flex-col items-center justify-center text-white">
    <slot></slot>
</div>
    
</template>

<script>
export default {
    
}
</script>

<style>
    .banner-half {
        height: 42vh;
    }

    .banner-half input, label {
        position:relative;
        z-index:1; /* make sure fields are visible above darkening layer */
    }
</style>

