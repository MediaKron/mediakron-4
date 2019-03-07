<template>
    <article class="container">
        <ItemTitle></ItemTitle>
        <ItemCaption></ItemCaption>
        <item-image></item-image>
        <ItemDescription></ItemDescription>

    </article>
</template>

<script>
import ItemTitle from '@/components/items-shared/ItemTitle'
import ItemDescription from '@/components/items-shared/ItemDescription'
import ItemCaption from '@/components/items-shared/ItemCaption'
import ItemImage from '@/components/items-shared/Image'

import { mapGetters, mapActions } from 'vuex'

export default { 
    props: [ 'item' ],
    components: {
        ItemTitle,
        ItemDescription,
        ItemCaption,
        ItemImage
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