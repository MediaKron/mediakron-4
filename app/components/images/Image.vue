<template>
    <img 
        :src="path" 
        :title="title" 
        :alt="alt" 
        v-bind:class="classes" 
        />
</template>

<script>
export default {
    props: {
        path: String, 
        title: String, 
        alt: String, 
        classes: String
    }
}
</script>

<style>

</style>
