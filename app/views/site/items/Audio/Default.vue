<template>
  <article class="container max-w-lg mx-auto">
        <ItemTitle></ItemTitle>
        <ItemCaption></ItemCaption>
        <Audio></Audio>
        <ItemDescription></ItemDescription>
        <ItemMetadata></ItemMetadata>
        <ItemTags></ItemTags>
   </article>
</template>

<script>
import ItemTitle from '@/components/items-shared/ItemTitle'
import ItemDescription from '@/components/items-shared/ItemDescription'
import ItemCaption from '@/components/items-shared/ItemCaption'
import Audio from '@/components/items-shared/Audio'
import ItemMetadata from '@/components/items-shared/ItemMetadata'
import ItemTags from '@/components/items-shared/ItemTags'
import { mapActions, mapGetters } from 'vuex'

export default {
    props: [ 'item', 'isEditing' ],
    components: {
        ItemTitle,
        ItemDescription,
        ItemCaption,
        Audio,
        ItemMetadata,
        ItemTags
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
