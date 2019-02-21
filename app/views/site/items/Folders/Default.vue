<template>
    <article class="container">
        <ItemTitle :isEditing="isEditing"></ItemTitle>
        <ItemCaption :isEditing="isEditing"></ItemCaption>
        <FolderList :children="this.editItem.children"></FolderList>
        <ItemDescription :isEditing="isEditing"></ItemDescription>
    </article>
</template>

<script>
import ItemTitle from '@/components/items-shared/ItemTitle'
import ItemDescription from '@/components/items-shared/ItemDescription'
import ItemCaption from '@/components/items-shared/ItemCaption'
import FolderList from '@/components/items-shared/FolderList'

import { mapGetters, mapActions } from 'vuex'

export default {
    props: [ 'item', 'isEditing' ],
    components: {
        ItemTitle,
        ItemDescription,
        ItemCaption,
        FolderList
    },
    data() {
        return {

        }
    },
    created() {
        this.setEditItem(this.item)
        console.log(this.editItem)
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
