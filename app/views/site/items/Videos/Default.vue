<template>
   <div class="container">
        <ItemTitle :isEditing="isEditing"></ItemTitle>
        <ItemDescription :isEditing="isEditing"></ItemDescription>
        <ItemCaption :isEditing="isEditing"></ItemCaption>
   </div>
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
        this.setEditItem(this.item)
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
