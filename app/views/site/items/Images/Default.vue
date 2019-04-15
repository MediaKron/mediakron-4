<template>
    <article>
        <ItemTitle class="max-w-40 item-title mx-auto"></ItemTitle>
        <ItemCaption class="py-2 max-w-40 mx-auto" ></ItemCaption>
        <item-image class="mx-auto"></item-image>
        <ItemDescription class="max-w-40 mx-auto text-xl py-3"></ItemDescription>
        <ItemMetadata class="max-w-40 mx-auto"></ItemMetadata>
        <ItemTags class="max-w-40 mx-auto"></ItemTags>
    </article>
</template>

<script>
import ItemTitle from '@/components/items-shared/ItemTitle'
import ItemDescription from '@/components/items-shared/ItemDescription'
import ItemCaption from '@/components/items-shared/ItemCaption'
import ItemImage from '@/components/items-shared/Image'
import ItemMetadata from '@/components/items-shared/ItemMetadata'
import ItemTags from '@/components/items-shared/ItemTags'

import { mapGetters, mapActions } from 'vuex'

export default { 
    props: [ 'item' ],
    components: {
        ItemTitle,
        ItemDescription,
        ItemCaption,
        ItemImage,
        ItemMetadata,
        ItemTags
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