<template>
    <b-form-group
            v-if="isEditing"
            label="Replace Video"
            label-for="fileUpload">
        <h5>Current Video</h5>
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
        <h5>Video File1</h5>
        <vue-plyr>
            <video poster="poster.png" src="video.mp4">
                <source src="video-720p.mp4" type="video/mp4" size="720">
                <source src="video-1080p.mp4" type="video/mp4" size="1080">
                <track kind="captions" label="English" srclang="en" src="captions-en.vtt" default>
            </video>
        </vue-plyr>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import VuePlyr from 'vue-plyr'
    import 'vue-plyr/dist/vue-plyr.css' // only if your build system can import css, otherwise import it wherever you would import your css.
    import Vue from 'vue'
    Vue.use(VuePlyr)

    export default {
        name: 'Component',
        mounted() {
            console.log(this.player)
        },
        computed: {
            player() {
                return this.$refs.plyr.player
            }
        },
        data() {
            return {


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
