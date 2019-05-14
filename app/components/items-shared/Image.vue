<template>
    <div v-if="isEditing" class="relative mt-16">
        <b-form-group label="Add/Edit Image" label-sr-only label-for="fileUpload" class="max-w-40 mx-auto">
            <b-form-file v-model="editItem.newImage" :state="Boolean(editItem.newImage)"
                placeholder="Replace Image (choose a file)..." drop-placeholder="Drop file here..."
                :accept="current.allowedTypes()" @change="change" />
        </b-form-group>
        <viewer :images="image" class="image-editing image-viewer flex">
            <b-img :tabindex="0" class="mx-auto" :src="image" fluid v-b-tooltip.hover title="Click to Zoom Image">
            </b-img>
        </viewer>
    </div>
    <div v-else>
        <viewer :images="image" class="image-viewer flex">
            <b-img :tabindex="0" class="mx-auto" :src="image" fluid v-b-tooltip.hover title="Click to Zoom Image">
            </b-img>
        </viewer>
    </div>
</template>

<script>
    import {
        mapActions,
        mapGetters
    } from 'vuex'
    import 'viewerjs/dist/viewer.css'
    import Viewer from 'v-viewer'
    import Vue from 'vue'
    import imageSizeMixin from '@/components/mixins/ImageSize'
    Vue.use(Viewer, {
        defaultOptions: {
            inline: false,
            //    backdrop:false,
            //    zoomRatio: 0.000000001,
            title: true,
            navbar: false,
            button: true,
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
            }
        }
    })
    export default {
        mixins: [
            imageSizeMixin
        ],
        name: 'MImage',
        data() {
            return {
                tempImage: false
            }
        },
        computed: {
            image() {
                if (this.isEditing) {
                    if (this.tempImage) {
                        return this.tempImage;
                    }
                    return this.current.imageUrl('double');
                }
                return [this.current.imageUrl('double')];
            },
            ...mapGetters('items', [
                'editItem',
                'isEditing',
                'currentItem',
                'current',
                'isUploading',
                'isUploaded',
            ]),

        },
        methods: {
            ...mapActions('items', [
                'upload'
            ]),
            change(event) {
                let reader = new FileReader(),
                    parent = this;
                reader.onload = function () {
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
    /* 
.image-frame {
    max-height: calc(100vh - 10rem);
} */

    .image-editing {
        position: relative;
        top: -6rem;
    }

    .image-viewer img {
        cursor: zoom-in;
        max-height: calc(100vh - 15rem);
    }

    .viewer-backdrop {
        background-color: rgba(0, 0, 0, .8) !important;
    }
</style>