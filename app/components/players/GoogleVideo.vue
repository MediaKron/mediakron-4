<template>
    <vue-plyr>
        <div class="plyr__video-embed">
            <iframe
                allowfullscreen allowtransparency allow="autoplay" :src= GoogleUrl>
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
        GoogleUrl(){
            var url = this.first.video.url;
            // TODO: Sanitize this
            var google = 'https://docs.google.com/';
            if (url) {
                url = url.replace("https://", '');
                url = url.replace("http://", '');
                url = url.replace("//", '');
                url = url.replace("/preview", '');
                url = url.replace("/view", '');
                url = url.replace("/edit", '');
                url = url.replace('?usp=sharing', '');
                url = url.replace('/a/bc.edu', '');
                url = url.replace("&authuser=0", '');
                url = url.replace('open?id=', 'file/d/');
                url = url.replace("docs.google.com/", '');
                url = url.replace("drive.google.com/", '');

                url = google + url + '/preview';
                /*
                var start = this.timeToSeconds(video.start);
                var end = this.timeToSeconds(video.end);

                if (start !== false) {
                    url = url + '?start=' + start;
                    if (end !== false) url = url + '&end=' + end;
                }
                return url;
            } else {
                return '';
            }
 */

            return url;
            }
        },
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
        mounted() {
            consol.log(this.first.video.url)
        }


    }
}
</script>

<style>

</style>
