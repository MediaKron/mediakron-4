<template>
    <div class="container">
        <ItemTitle :isEditing="isEditing"></ItemTitle>
        <ItemDescription :isEditing="isEditing"></ItemDescription>
        <div v-if="!isEditing">
            <h5>Image File</h5>
            <b-img :src="this.images[0]" fluid thumbnail alt="Responsive image"/>
            <p>{{ editItem.caption }}</p>
            <div v-if="editItem.metadata && editItem.metadata.citation">
                <h5>Source</h5>
                <p>{{ editItem.metadata.citation }}</p>
            </div>
        </div>
        <b-form class="container" v-else>
            <b-form-group
                label="Replace Image"
                label-for="fileUpload">
                <b-form-file
                    v-model="editItem.newImage"
                    :state="Boolean(editItem.newImage)"
                    placeholder="Choose a file..."
                    drop-placeholder="Drop file here..."
                    accept=".jpg, .png, .gif"/>
            </b-form-group>
            <b-form-group
                label="Edit Caption"
                label-for="caption">
                <b-form-input id="caption" v-model="editItem.caption"></b-form-input> 
            </b-form-group>
            <b-form-group
                label="Edit Citation"
                label-for="source">
                <b-form-textarea id="source" v-model="editItem.metadata.citation" rows="3" placeholder="Add Citation Here"></b-form-textarea>
            </b-form-group>
            
        </b-form>
    </div>
</template>

<script>
import ItemTitle from '@/components/items-shared/ItemTitle'
import ItemDescription from '@/components/items-shared/ItemDescription'
import { mapGetters, mapActions } from 'vuex'

export default {
    props: [ 'item', 'isEditing' ],
    components: {
        ItemTitle,
        ItemDescription
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
