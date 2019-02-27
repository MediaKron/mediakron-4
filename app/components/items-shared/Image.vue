<template>
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
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            images: [
                'https://picsum.photos/300?image=342',
            ],
        }
    },
    computed: {
        ...mapGetters('items', [
            'editItem',
            'isEditing',
            'first'
        ])
    }
}
</script>

<style>

</style>
