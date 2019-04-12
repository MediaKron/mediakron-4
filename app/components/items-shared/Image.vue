<template>
    <b-form-group 
        v-if="isEditing"
        label="Current Image"
        label-for="fileUpload">
        <b-img :src="image" fluid thumbnail alt="Responsive image"/>
        <b-form-file
            v-model="editItem.newImage"
            :state="Boolean(editItem.newImage)"
            placeholder="Replace Image (choose a file)..."
            drop-placeholder="Drop file here..."
            :accept="first.allowedTypes()"
            @change="change" />
    </b-form-group>
    <div v-else>
        <viewer :images="image">
            <img class="image-frame invisible" :src="image" >
        </viewer>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
import imageSizeMixin from '@/components/mixins/ImageSize'
Vue.use(Viewer, {
  defaultOptions: {
   inline:true,
   backdrop:false,
   zoomRatio: 0.000000001,
   title:false,
   navbar:false,
   button:false,
   toolbar: {
    zoomIn: 2,
    zoomOut: 2,
    oneToOne: 0,
    reset: 2,
    prev: 0,
    play: {
      show: 0,
      size: 'large',
    },
    next: 0,
    rotateLeft: 2,
    rotateRight: 2,
    flipHorizontal: 0,
    flipVertical: 0,
  },
  }
})
export default {
    mixins:[
        imageSizeMixin
    ],
    data() {
        return {
            tempImage: false
        }        
    },
    computed: {
        image(){
            if(this.isEditing){
                if(this.tempImage){
                    return this.tempImage;
                }
                return this.first.imageUrl('large');
            }
            return [ this.first.imageUrl('large') ];
        },
        ...mapGetters('items', [
            'editItem',
            'isEditing',
            'currentItem',
            'first',
            'isUploading',
            'isUploaded',
        ]),

    },
    methods: {
        ...mapActions('items',[
            'upload'
        ]),
        change(event){
            let reader = new FileReader(),
                parent = this;
            reader.onload = function(){
                let dataURL = reader.result;
                parent.tempImage = dataURL;
            };
            reader.readAsDataURL(event.target.files[0]);
            return this.upload(event)
        }
        
    }
}
</script>

<style>

.image-frame {
    max-height: calc(100vh - 10rem);
}

</style>
