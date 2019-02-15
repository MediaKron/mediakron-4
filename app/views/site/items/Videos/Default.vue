<template>
   <div>
      <b-form class="container">
         <b-form-group v-if=isEditing
                       label="Edit title"
                       label-for="title">
            <b-input v-if="isEditing" id="title" :value="itemCopy.title"></b-input>
         </b-form-group>
         <div v-else>
            <div>{{ itemCopy.title }}</div>
         </div>
         <b-form-group v-if=isEditing
                       label="Edit description"
                       label-for="description">
            <b-input v-if="isEditing" id="description" :value="itemCopy.description"></b-input>
         </b-form-group>
         <div v-else>
            <div>{{ itemCopy.description }}</div>
         </div>
         <b-form-group v-if=isEditing
                       label="replace video file"
                       label-for="fileUpload">
            <b-form-file
                    v-model="file"
                    :state="Boolean(file)"
                    placeholder="Choose a file..."
                    drop-placeholder="Drop file here..."
            />
         </b-form-group>
         <div v-else>
            <vue-plyr>
               <video poster="poster.png" src="video.mp4">
                  <source src="video-720p.mp4" type="video/mp4" size="720">
                  <source src="video-1080p.mp4" type="video/mp4" size="1080">
                  <track kind="captions" label="English" srclang="en" src="captions-en.vtt" default>
               </video>
            </vue-plyr>
            <div>{{ itemCopy.uri }}</div>
         </div>
      </b-form>
   </div>
</template>

<script>
    import Vue from 'vue'
    import VuePlyr from 'vue-plyr'
    import 'vue-plyr/dist/vue-plyr.css' // only if your build system can import css, otherwise import it wherever you would import your css.

    Vue.use(VuePlyr)
export default {
    props: ['item', 'isEditing'],
    name: 'Component',
    mounted() {
        console.log(this.player)
    },
    computed: {
        player() {
            return this.$refs.plyr.player
        }
    },
    data() {
        return {
            itemCopy: Object.assign({}, this.item)
        }
    }
}

</script>

<style>

</style>
