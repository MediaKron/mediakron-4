<template>
    <div v-if="isEditing">
        <b-form-group
            label="Video URL: (YouTube, Vimeo, Google, Panopto...)"
            label-for="url">
            <b-button v-if="editItem.video.type == 'mp4'" v-b-toggle.urlCollapse class="mb-3">
                Add Video As Link
            </b-button>
            <b-collapse id="urlCollapse" :visible="editItem.video.type != 'mp4'">
                <b-form-input id="url" v-model="editItem.video.url" type="text" :placeholder=editItem.video.url @input="urlChanged" aria-describedby="inputFormatterHelp"/>
                <b-form-text id="inputFormatterHelp" v-if="!isValidUrl">
                    Video url not recognized or not supported
                </b-form-text>
            </b-collapse>
        </b-form-group>
        <b-form-group
            label="Video File"
            label-for="fileUpload">
            <b-button v-if="editItem.video.type != 'mp4'" v-b-toggle.mp4Collapse class="mb-3">
                Add Video As Mp4
            </b-button>
            <b-collapse id="mp4Collapse" :visible="editItem.video.type == 'mp4'">
                 <b-form-file
                    v-model="editItem.newImage"
                    :state="Boolean(editItem.newImage)"
                    :placeholder= editItem.video.url
                    drop-placeholder="Drop file here..."
                    :accept="current.allowedTypes()"/>
                <b-progress height="2rem" v-if="isUploading" :value="counter" :max="max" show-progress animated />
            </b-collapse>
        </b-form-group>
    </div>
    <div v-else>
        {{ current.video.type }}
        <component :is="player"></component>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Youtube from '@/components/players/Youtube'
    import GoogleVideo from '@/components/players/GoogleVideo'
    import PanoptoVideo from '@/components/players/PanoptoVideo'
    import Mp4 from '@/components/players/Mp4'
    import VueMultiselect from "../../../node_modules/vue-multiselect/src/Multiselect";
    export default {
        components: {VueMultiselect},
        name: 'Component',
        mounted() {
            const type = this.current.video.type
            this.typeFormat = { "value": type, "text": type.charAt(0).toUpperCase() + type.slice(1) }
        },
        data() {
            return {
                typeFormat: [],
                typeOptions: [
                    {value:'youtube', text: 'Youtube'},
                    {value:'google', text: 'Google'},
                    {value:'panopto', text: 'Panopto'},
                    {value:'vimeo', text: 'Vimeo'},
                    {value:'mp4', text: 'Mp4'}
                ],
                isValidUrl: true,
            }
        },
        computed: {
            player(){
                switch(this.current.video.type){
                    case 'youtube':
                        return Youtube
                    case 'google':
                        return GoogleVideo
                    case 'vimeo':
                        return Vimeo
                    case 'panopto':
                        return PanoptoVideo
                    case 'mp4':
                        return Mp4
                }
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
                const url = this.editItem.video.url
                this.isValidUrl = true

                if (url.includes('https://www.youtube.com')) {
                    this.editItem.video.type = 'youtube'
                    return Youtube
                } else if (url.includes('https://www.vimeo.com')) {
                    this.editItem.video.type = 'vimeo'
                    return 'Vimeo'
                } else if (url.includes('https://drive.google.com' || 'https://docs.google.com')) {
                    this.editItem.video.type = 'google'
                    return 'GoogleVideo'
                } else if (url.includes('https://bc.hosted.panopto.com')) {
                    this.editItem.video.type = 'panopto'
                    return PanoptoVideo
                } else if (url.includes('/files/')) {
                    if (url.includes('.mp4')){
                        this.editItem.video.type = 'mp4'
                        return 'Mp4'
                    }

                } else {
                    this.isValidUrl = false
                }
                
            }
        }
    }
</script>

<style>

</style>
