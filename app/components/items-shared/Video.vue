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
        <b-progress height="2rem" v-if="isUploading" :value="counter" :max="max" show-progress animated />
    </b-form-group>
    <div v-else>
        <vue-plyr>
           <div class="plyr__video-embed">
                <iframe
                src="https://www.youtube.com/embed/bTqVqk7FSmY?iv_load_policy=3&modestbranding=1&playsinline=1&showinfo=0&rel=0&enablejsapi=1"
                allowfullscreen allowtransparency allow="autoplay">
                </iframe>
            </div>
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
        data() {
            return {
            }
        },
        computed: {
            player() {
                return this.$refs.plyr.player
            },
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
