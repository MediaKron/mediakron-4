<template>
    <article class="container">
        <ItemTitle></ItemTitle>
        <ItemCaption></ItemCaption>
        <item-image></item-image>
        <ItemDescription></ItemDescription>
        <ItemMetadata></ItemMetadata>
    </article>
</template>

<script>
import ItemTitle from '@/components/items-shared/ItemTitle'
import ItemDescription from '@/components/items-shared/ItemDescription'
import ItemCaption from '@/components/items-shared/ItemCaption'
import ItemImage from '@/components/items-shared/Image'
import ItemMetadata from '@/components/items-shared/ItemMetadata'

import { mapGetters, mapActions } from 'vuex'

export default { 
    props: [ 'item' ],
    components: {
        ItemTitle,
        ItemDescription,
        ItemCaption,
        ItemImage,
        ItemMetadata
    },
    created() {

    },
    computed: {
        ...mapGetters('items', [
            'editItem',
            'isEditing'
        ])
    },
    methods: {
        ...mapActions('items', [
            'setEditItem',
        ])
    }
}
</script>

<style>

</style>