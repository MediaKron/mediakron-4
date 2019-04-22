<template>
    <article class="container">
        <ItemTitle></ItemTitle>
        <item-map></item-map>
        <ItemDescription></ItemDescription>
        <ItemCaption></ItemCaption>
        <ItemMetadata></ItemMetadata>
        <ItemTags></ItemTags>
    </article>
</template>

<script>
import ItemMap from '@/components/items-shared/Map'
import ItemTitle from '@/components/items-shared/ItemTitle'
import ItemDescription from '@/components/items-shared/ItemDescription'
import ItemCaption from '@/components/items-shared/ItemCaption'
import Image from '@/components/items-shared/Image'
import ItemMetadata from '@/components/items-shared/ItemMetadata'
import ItemTags from '@/components/items-shared/ItemTags'

import { mapGetters, mapActions } from 'vuex'

export default {
    props: [ 'item' ],
    components: {
        ItemTitle,
        ItemDescription,
        ItemCaption,
        Image,
        ItemMetadata,
        ItemTags,
        ItemMap
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
