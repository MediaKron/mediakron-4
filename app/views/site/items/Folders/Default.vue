<template>
    <article class="container">
        <ItemTitle></ItemTitle>
        <ItemCaption></ItemCaption>
        <List></List>
        <ItemDescription></ItemDescription>
    </article>
</template>

<script>
import ItemTitle from '@/components/items-shared/ItemTitle'
import ItemDescription from '@/components/items-shared/ItemDescription'
import ItemCaption from '@/components/items-shared/ItemCaption'
import List from '@/components/item-lists/List'

import { mapGetters, mapActions } from 'vuex'

export default {
    props: [ 'item', 'isEditing' ],
    components: {
        ItemTitle,
        ItemDescription,
        ItemCaption,
        List
    },
    data() {
        return {

        }
    },
    created() {

    },
    computed: {
        ...mapGetters('items', ['editItem'])
    },
    methods: {
        ...mapActions('items', ['setEditItem'])
    }
}
</script>

<style>

</style>
