<template>
  <article class="container max-w-lg mx-auto">
        <m-title></m-title>
        <m-caption></m-caption>
        <m-audio></m-audio>
        <m-description></m-description>
        <m-metadata></m-metadata>
        <m-tags></m-tags>
   </article>
</template>

<script>
import MTitle from '@/components/items-shared/Title'
import MDescription from '@/components/items-shared/Description'
import MCaption from '@/components/items-shared/Caption'
import MVideo from '@/components/items-shared/Video'
import MMetadata from '@/components/items-shared/Metadata'
import MTags from '@/components/items-shared/Tags'
import MCustomDate from '@/components/items-shared/CustomDate'
import MImage from '@/components/items-shared/Image'

import MAudio from '@/components/items-shared/Audio'

import { mapActions, mapGetters } from 'vuex'

export default {
    props: [ 'item', 'isEditing' ],
    components: {
        MTitle,
        MDescription,
        MCaption,
        MImage,
        MMetadata,
        MTags,
        MCustomDate,
        MAudio
    },
    created() {
    },
    computed: {
        ...mapGetters('items', [
            'editItem'
        ])
    },
    methods: {
        ...mapActions('items', [
            'setEditItem'
        ])
    }  
}

</script>

<style>

</style>
