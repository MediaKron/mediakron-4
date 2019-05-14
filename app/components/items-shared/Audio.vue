<template>
    <div v-if="isEditing">
    <b-form-group
            label="Audio URL"
            label-for="url">
        <b-button v-if="editItem.audio.type == 'mp3'" v-b-toggle.urlCollapse class="mb-3">
            Add Audio As Link
        </b-button>
        <b-collapse id="urlCollapse" :visible="editItem.audio.type != 'mp4'">
            <b-form-input id="url" v-model="editItem.audio.url" type="text" :placeholder=editItem.audio.url @input="urlChanged" aria-describedby="inputFormatterHelp"/>
            <b-form-text id="inputFormatterHelp" v-if="!isValidUrl">
                Audio url not recognized or not supported
            </b-form-text>
        </b-collapse>
    </b-form-group>
        <b-form-group
                label="Audio File"
                label-for="fileUpload">
            <b-button v-if="editItem.audio.type != 'mp3'" v-b-toggle.mp4Collapse class="mb-3">
            Add Audio As Mp3
            </b-button>
    <b-collapse id="mp3Collapse" :visible="editItem.audio.type == 'mp3'">
        <b-form-file
                v-model="editItem.newImage"
                :state="Boolean(editItem.newImage)"
                :placeholder= editItem.audio.url
                drop-placeholder="Drop file here..."
                :accept="current.allowedTypes()"/>
        <b-progress height="2rem" v-if="isUploading" :value="counter" :max="max" show-progress animated />
    </b-collapse>
    </b-form-group>
    </div>
    <div v-else class="audio-player">
        {{ current.audio.type }}
        <vue-plyr>
            <component :is="player"></component>

        </vue-plyr>
    </div>

</template>

<script>
    import { mapGetters } from 'vuex'
    import VuePlyr from 'vue-plyr'
    import 'vue-plyr/dist/vue-plyr.css' // only if your build system can import css, otherwise import it wherever you would import your css.
    import Vue from 'vue'
    import Mp3 from '@/components/players/Mp3'
    import Mp4 from '@/components/players/Mp4'
    import PanoptoVideo from '@/components/players/PanoptoVideo'
    import GoogleVideo from '@/components/players/GoogleVideo'
    import Vimeo from '@/components/players/Vimeo'
    import Youtube from '@/components/players/Youtube'

    Vue.use(VuePlyr)

    export default {
        mounted() {
            const type = this.current.audio.type
            this.typeFormat = { "value": type, "text": type.charAt(0).toUpperCase() + type.slice(1) }
            const url = this.current.audio.url
             console.log(this.current.audio)
        },
        data() {
            return {
                typeFormat: [],
                typeOptions: [
                    {value:'youtube', text: 'Youtube'},
                    {value:'google', text: 'Google'},
                    {value:'panopto', text: 'Panopto'},
                    {value:'vimeo', text: 'Vimeo'},
                    {value:'mp3', text: 'Mp3'}
                ],
                isValidUrl: true,
            }
        },
        computed: {
            player(){
                switch(this.current.audio.type){
                    case 'youtube':
                        return Youtube
                    case 'google':
                        return GoogleVideo
                    case 'vimeo':
                        return Vimeo
                    case 'panopto':
                        return PanoptoVideo
                    case 'mp3':
                        return Mp3
                        //return this.$refs.plyr.player
                }
                //return this.$refs.plyr.player
            },
            ...mapGetters('items', [
                'editItem',
                'isEditing',
                'currentItem',
                'current',
                'isUploading',
                'isUploaded',

            ]),


        },
        methods: {
            urlChanged() {
                const url = this.editItem.audio.url
                this.isValidUrl = true

                if (url.includes('https://www.youtube.com')) {
                    this.editItem.audio.type = 'youtube'
                    return Youtube
                } else if (url.includes('https://www.vimeo.com')) {
                    this.editItem.audio.type = 'vimeo'
                    return 'Vimeo'
                } else if (url.includes('https://drive.google.com' || 'https://docs.google.com')) {
                    this.editItem.audio.type = 'google'
                    return 'GoogleVideo'
                } else if (url.includes('https://bc.hosted.panopto.com')) {
                    this.editItem.audio.type = 'panopto'
                    return PanoptoVideo
                } else if (url.includes('/files/')) {
                    if (url.includes('.mp3')) {
                        this.editItem.audio.type = 'mp3'
                        return 'Mp3'
                    }

                } else {
                    this.isValidUrl = false
                }

            },
        },
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
