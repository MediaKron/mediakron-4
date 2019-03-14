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

            //var start = this.timeToSeconds(video.start);
            //var end = this.timeToSeconds(video.end);

           // if (start !== false) {
//                /* if video has start/stop timecodes  */
//                url = url.replace(".mp4", '');
//                url = url.replace("bc.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=", 'bc.hosted.panopto.com/Panopto/Podcast/Stream/');
//                url = url + '.mp4';
//
//                url = url + '#t=' + start;
//                if (end !== false) url = url + ',' + end;
//
//                embed = '<video class="panopto-video" src="' + url + ' " controls>Sorry, you will need to update your browser to view this video. </video>'
//                return embed;
//            } else {
//
//                url = url.replace("bc.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=", 'bc.hosted.panopto.com/Panopto/Pages/Embed.aspx?id=');
//
//                embed = '<div class="panopto-container"><iframe src="' + url + '" width="100%" height="100%" style="padding: 0px; border: 1px solid #464646;" frameborder="0"></iframe></div>';
//                return embed;
//            }
//
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
            
    },
}
</script>

<style>

</style>
