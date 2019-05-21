<template>
    <b-button class="uppercase mb-2 flex flex-column items-center bg-light border-none item-button" variant="outline-dark" size="sm" @click="editClicked">
        <font-awesome-icon icon="edit" class="text-lg mt-1" /> <span class="text-xs mt-1">Edit</span>
    </b-button>
</template>

<script>
    import editable from '~/components/mixins/editable';
    export default {
        mixins: [editable],
    }
</script>

<style>

</style>

