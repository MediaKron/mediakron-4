<template>
    <vue-plyr>
        <div class="plyr__video-embed">
                <iframe
                        allowfullscreen allowtransparency allow=“autoplay” :src="PanoptoUrl" width="100%" height="1000">
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
        PanoptoUrl(){
            var embed =''
            var url = this.first.video.url;
            // TODO: Sanitize this
            url = url.replace("http://", 'https://');

            var start = this.first.video.start
            var end = this.first.video.stop

            if (start !== null && start !== undefined) {
                /* if video has start/stop timecodes  */
                url = url.replace(".mp4", '');
                url = url.replace("bc.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=", 'bc.hosted.panopto.com/Panopto/Podcast/Stream/');
                url = url + '.mp4';

                url = url + '#t=' + start;
                if (end !== false) url = url + ',' + end;

                return url;
            } else {

                url = url.replace("bc.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=", 'bc.hosted.panopto.com/Panopto/Pages/Embed.aspx?id=');
                return url;
            }

            return url;
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
    },
    methods: {
        timeToSeconds: function(time) {
            if (time) {
                if (time !== '') {
                    if (time.indexOf(':') > -1) {
                        var split = time.split(':'),
                            hour = 0,
                            min = 0,
                            sec = 0,
                            timecode = 0;

                        if (split.length == 3) {
                            hour = parseInt(split[0], 10);
                            min = parseInt(split[1], 10);
                            sec = parseInt(split[2], 10);
                        } else if (split.length == 2) {
                            min = parseInt(split[0], 10);
                            sec = parseInt(split[1], 10);
                        }
                        timecode = (hour * 60 * 60) + (min * 60) + sec;
                        return timecode;
                    } else {
                        return parseInt(time, 10);
                    }
                }
            }
            return false;
        },
    },
}
</script>

<style>

</style>
