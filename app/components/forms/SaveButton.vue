<template>
    <b-button class="uppercase mb-2 flex flex-column items-center border-none item-button"
        variant="primary" size="sm" @click="saveClicked">
        <font-awesome-icon icon="check" class="text-lg mt-1" /> <span class="text-xs mt-1">Save </span>
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