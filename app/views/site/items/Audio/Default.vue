<template>
  <article class="">
        <m-title class="max-w-2xl mx-auto"></m-title>
        <m-caption class="py-2 max-w-2xl mx-auto" ></m-caption>
        <m-audio class="max-w-2xl mx-auto"></m-audio>
        <m-custom-date class="max-w-2xl mx-auto" ></m-custom-date>
        <m-description class="max-w-2xl mx-auto text-xl pb-3"></m-description>
        <m-source class="max-w-2xl mx-auto text-xl"></m-source>
        <m-metadata class="max-w-2xl mx-auto"></m-metadata>
        <m-tags class="max-w-2xl mx-auto"></m-tags>
        <m-transcript class="max-w-2xl mx-auto text-xl"></m-transcript>
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
