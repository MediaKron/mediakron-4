<template>
    <b-form-group
            v-if="isEditing"
            label="Replace Video"
            label-for="fileUpload">
        <h5>Current Video</h5>
        <b-form-file
                v-hide
                v-model="editItem.newImage"
                :state="Boolean(editItem.newImage)"
                placeholder="Choose a file..."
                drop-placeholder="Drop file here..."
                :accept="first.allowedTypes()"/>

                <b-progress height="2rem" v-if="isUploading" :value="counter" :max="max" show-progress animated />

        <vue-multiselect  v-model="typeFormat" :options="typeOptions" class="mr-2 border border-dark rounded" track-by="value" label="text" placeholder="Choose Video Format:">
        </vue-multiselect>
    </b-form-group>

        <div v-else>
        <component :is="player"></component>
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
            console.log(this.player)
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


        }
    }
</script>

<style>

</style>
