<template>
  <article class="container">
        <ItemTitle></ItemTitle>
        <ItemCaption></ItemCaption>
        <ItemDescription></ItemDescription>
        <ItemMetadata></ItemMetadata>
   </article>
</template>

<script>
import ItemTitle from '@/components/items-shared/ItemTitle'
import ItemDescription from '@/components/items-shared/ItemDescription'
import ItemCaption from '@/components/items-shared/ItemCaption'
import ItemMetadata from '@/components/items-shared/ItemMetadata'
import { mapActions, mapGetters } from 'vuex'

export default {
    props: [ 'item', 'isEditing' ],
    components: {
        ItemTitle,
        ItemDescription,
        ItemCaption,
        ItemMetadata
    },
    created() {
    },
    computed: {
        ...mapGetters('items', [
            'editItem'
        ])
    },
    methods: {
        ...mapActions('items', [
            'setEditItem'
        ])
    }  
}

</script>

<style>

</style>
