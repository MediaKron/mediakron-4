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
        <b-progress height="2rem" v-if="isUploading" :value="counter" :max="max" show-progress animated />
    </b-form-group>
    <div v-else class="audio-player">
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

.audio-player .plyr--audio .plyr__controls{
    background:#eee;
    border-radius:.25rem;
    border:1px solid #ccc;  
}

.audio-player .plyr--full-ui input[type="range"] {
 color:#000;
}

.plyr--audio .plyr__control.plyr__tab-focus, .plyr--audio .plyr__control:hover, .plyr--audio .plyr__control[aria-expanded="true"] {
    background: #000;
    color: #fff;
}

</style>
