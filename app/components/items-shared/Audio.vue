<template>
    <b-form-group
            v-if="isEditing"
            label="Replace Audio"
            label-for="fileUpload">
        <h5>Current Audio</h5>
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
        <vue-plyr>
            <audio crossorigin playsinline>
                <source src="https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.mp3" type="audio/mp3">
                <source src="https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.ogg" type="audio/ogg">
            </audio>
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
