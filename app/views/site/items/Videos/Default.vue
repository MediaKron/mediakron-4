<template>
  <article class="">
        <m-title class="max-w-2xl mx-auto"></m-title>
        <m-caption class="py-2 max-w-2xl mx-auto" ></m-caption>
        <m-video class="mx-auto"></m-video>
        <m-custom-date class="py-2 max-w-2xl mx-auto" ></m-custom-date>
        <m-description class="max-w-2xl mx-auto text-xl py-3"></m-description>
        <m-metadata class="max-w-2xl mx-auto"></m-metadata>
        <m-tags class="max-w-2xl mx-auto"></m-tags>

   </article>
</template>

<script>
import MTitle from '@/components/items-shared/Title'
import MDescription from '@/components/items-shared/Description'
import MCaption from '@/components/items-shared/Caption'
import MImage from '@/components/items-shared/Image'
import MMetadata from '@/components/items-shared/Metadata'
import MTags from '@/components/items-shared/Tags'
import MCustomDate from '@/components/items-shared/CustomDate'

import MVideo from '@/components/items-shared/Video'

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
        MVideo
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
