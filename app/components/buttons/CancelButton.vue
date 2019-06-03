<template>
    <b-button @click="cancelClicked" class="uppercase mb-2 flex flex-column items-center bg-light border-none item-button" size="sm" variant="outline-dark">
         <font-awesome-icon icon="times" class="text-lg mt-1"/> <span class="text-xxs mt-1">Cancel</span>
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

