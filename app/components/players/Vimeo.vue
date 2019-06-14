<template>
    <vue-plyr>
        <div class="plyr__video-embed">
            <iframe
                allowfullscreen allowtransparency allow="autoplay" :src= url>
            </iframe>
        </div>
    </vue-plyr>
</template>

<script>
import { mapGetters } from 'vuex'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css' // only if your build system can import css, otherwise import it wherever you would import your css.
import Vue from 'vue'
Vue.use(VuePlyr)

export default {
    computed: {
        url(){
            var unsafeUrl = this.first.video.url;
            // TODO: Sanitize this
            return unsafeUrl;
        },
        player() {
            return this.$refs.plyr.player
        },
        ...mapGetters('items', [
            'editItem',
            'isEditing',
            'currentItem',
            'current',
            'isUploading',
            'isUploaded',

        ]),


    }
}
</script>

<style>

</style>
