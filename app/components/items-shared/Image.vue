<template>
    <b-form-group 
        v-if="isEditing"
        label="Current Image"
        label-for="fileUpload">
        <b-img :src="this.images[0]" fluid thumbnail alt="Responsive image"/>
        <b-form-file
            v-model="editItem.newImage"
            :state="Boolean(editItem.newImage)"
            placeholder="Replace Image (choose a file)..."
            drop-placeholder="Drop file here..."
            :accept="first.allowedTypes()"/>
        <b-progress height="2rem" v-if="isUploading" :value="counter" :max="max" show-progress animated />
    </b-form-group>
    <div v-else>
        <viewer :images="images">
            <img class="image-frame invisible" :src="this.images[0]" >
        </viewer>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer, {
  defaultOptions: {
   inline:true,
   backdrop:false,
   title:false,
   navbar:false,
   button:false,
   toolbar: {
    zoomIn: 4,
    zoomOut: 4,
    oneToOne: 4,
    reset: 4,
    prev: 0,
    play: {
      show: 4,
      size: 'large',
    },
    next: 0,
    rotateLeft: 4,
    rotateRight: 4,
    flipHorizontal: 0,
    flipVertical: 0,
  },
  }
})
export default {
    data() {
        return {
            images: [
                'https://picsum.photos/1000/1000/?random',
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

.image-frame {
    max-height: calc(100vh - 10rem);
}

</style>
