<template>
    <div>
        <b-form-group 
            v-if="isEditing"
            label="Video URL: (YouTube, Vimeo, Google,"
            label-for="url">
            <b-form-input id="url" v-model="editItem.video.url" type="text" placeholder="video url" @input="urlChanged" aria-describedby="inputFormatterHelp"/>
            <b-form-text id="inputFormatterHelp" v-if="!isValidUrl">
                Video url not recognized or not supported
            </b-form-text>
        </b-form-group>
        <b-form-group
                v-if="isEditing"
                label="Video File"
                label-for="fileUpload">
            <b-form-file
                    v-model="editItem.newImage"
                    :state="Boolean(editItem.newImage)"
                    placeholder="Choose a file..."
                    drop-placeholder="Drop file here..."
                    :accept="first.allowedTypes()"/>
                    <b-progress height="2rem" v-if="isUploading" :value="counter" :max="max" show-progress animated />
        </b-form-group>
        <div v-else>
            {{ first.video.type }}
            <component :is="player"></component>
        </div>
    </div>

</template>

<script>
    import { mapGetters } from 'vuex'
    import Youtube from '@/components/players/Youtube'
    import Multiselect from 'vue-multiselect'
    import VueMultiselect from "../../../node_modules/vue-multiselect/src/Multiselect";
    export default {
        components: {VueMultiselect},
        name: 'Component',
        mounted() {
            const type = this.first.video.type
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
                ],
                isValidUrl: true,
            }
        },
        computed: {
            player(){
                switch(this.first.video.type){
                    case 'youtube':
                        return Youtube
                    case 'google':
                        return Google
                    case 'panopto':
                        return Panopto
                }
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
            urlChanged() {
                const url = this.editItem.video.url
                this.isValidUrl = true

                if (url.includes('https://www.youtube.com', 0)) {
                    this.editItem.video.type = 'youtube'
                    return Youtube
                } else if (url.includes('https://www.vimeo.com', 0)) {
                    this.editItem.video.type = 'vimeo'
                    return 'asdf'
                } else {
                    this.isValidUrl = false
                }
                
            }
        }
    }
</script>

<style>

</style>
