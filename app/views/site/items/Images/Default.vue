<template>
    <article class="container">
        <ItemTitle :isEditing="isEditing"></ItemTitle>
        <ItemDescription :isEditing="isEditing"></ItemDescription>
        <b-form-group 
            v-if="isEditing"
            label="Replace Image"
            label-for="fileUpload">
            <b-form-file
                v-model="editItem.newImage"
                :state="Boolean(editItem.newImage)"
                placeholder="Choose a file..."
                drop-placeholder="Drop file here..."
                accept=".jpg, .png, .gif"/>
        </b-form-group>
        <div v-else>
            <h5>Image File</h5>
            <b-img :src="this.images[0]" fluid thumbnail alt="Responsive image"/>
        </div>
        <ItemCaption :isEditing="isEditing"></ItemCaption>
    </article>
</template>

<script>
import ItemTitle from '@/components/items-shared/ItemTitle'
import ItemDescription from '@/components/items-shared/ItemDescription'
import ItemCaption from '@/components/items-shared/ItemCaption'

import { mapGetters, mapActions } from 'vuex'

export default {
    props: [ 'item', 'isEditing' ],
    components: {
        ItemTitle,
        ItemDescription,
        ItemCaption
    },
    data() {
        return {
            images: [
                'https://picsum.photos/300?image=342',
            ],
        }
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
