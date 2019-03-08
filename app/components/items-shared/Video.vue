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
    </b-form-group>
    <div v-else>
        <component :is="player"></component>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Youtube from '@/components/players/Youtube'
    export default {
        name: 'Component',
        mounted() {
            console.log(this.player)
        },
        data() {
            return {
            }
        },
        computed: {
            player(){
                switch(this.first.video.type){
                    case 'youtube':
                        return Youtube
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
