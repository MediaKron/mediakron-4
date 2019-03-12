<template>
    <vue-plyr>
        <div class="plyr__video-embed">
            <iframe
                allowfullscreen allowtransparency allow="autoplay" :src= YoutubeUrl>
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
        YoutubeUrl(){
            //var unsafeUrl = this.first.video.url;
            // TODO: Sanitize this

            var url = this.first.video.url;
            var youtube = '//www.youtube.com/embed/';

                if (url) {
                    url = url.replace("https://", '');
                    url = url.replace("http://", '');
                    url = url.replace("//", '');
                    url = url.replace("www.", '');
                    url = url.replace("youtu.be/", '');
                    url = url.replace("youtube.com/embed/", '');
                    url = url.replace("youtube.com/watch?v=", '');
                    url = url.replace("&feature=youtu.be", '');
                    url = url.replace("&feature=plcp", '');
                    url = youtube + url;
/*
                    var start = this.first.timeToSeconds(video.start);
                    var end = this.first.timeToSeconds(video.end);

                    if (start !== false) {
                        url = url + '?start=' + start;
                        if (end !== false) url = url + '&end=' + end;
                    }
                    return url;
                    } else {
                        return '';
                    }
*/
                    return url
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


    }
}
</script>

<style>

</style>
