<template>
    <vue-plyr>
            <video poster="poster.png" src="">
                <source :src="Mp4Url" type="video/mp4" size="720">
                <source :src="Mp4Url" type="video/mp4" size="1080">
                <track kind="captions" label="English" srclang="en" src="" default>
            </video>
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
        Mp4Url(){
            var url = this.first.video.url;
            // TODO: Sanitize this

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
        /*
        timeToSeconds: function (time) {
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
        }
        */
    },
}
</script>

<style>

</style>
