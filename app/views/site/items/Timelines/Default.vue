<template>
  <article class="container">
        <ItemTitle></ItemTitle>
        <ItemCaption></ItemCaption>
        <ItemDescription></ItemDescription>

   </article>
</template>

<script>
import ItemTitle from '@/components/items-shared/ItemTitle'
import ItemDescription from '@/components/items-shared/ItemDescription'
import ItemCaption from '@/components/items-shared/ItemCaption'
import { mapActions, mapGetters } from 'vuex'

export default {
    props: [ 'item', 'isEditing' ],
    components: {
        ItemTitle,
        ItemDescription,
        ItemCaption
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
