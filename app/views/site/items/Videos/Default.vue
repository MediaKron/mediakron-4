<template>
   <div class="container">
       <ItemTitle :isEditing="isEditing"></ItemTitle>
   </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ItemTitle from '@/components/items-shared/ItemTitle'

export default {
    props: [ 'item', 'isEditing' ],
    components: {
        ItemTitle
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
