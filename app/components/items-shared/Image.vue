<template>
    <b-form-group 
        v-if="isEditing"
        label="Replace Image"
        label-for="fileUpload">
        <h5>Current Image</h5>
        <b-img :src="this.images[0]" fluid thumbnail alt="Responsive image"/>
        <b-form-file
            v-hide
            v-model="editItem.newImage"
            :state="Boolean(editItem.newImage)"
            placeholder="Choose a file..."
            drop-placeholder="Drop file here..."
            :accept="first.allowedTypes()"/>
        <b-progress height="2rem" v-if="uploading" :value="counter" :max="max" show-progress animated />
    </b-form-group>
    <div v-else>
        <h5>Image File1</h5>
        <viewer :images="images">
            <img :src="this.images[0]" >
        </viewer>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)

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
            'currentItem',
            'first',
            'isUploading',
            'isUploaded',

        ]),

    }
}
</script>

<style>

</style>
