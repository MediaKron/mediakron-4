<template>
    <article>
        <m-title class="max-w-40 mx-auto"></m-title>
        <m-caption class="py-2 max-w-40 mx-auto" ></m-caption>
        <m-image class="mx-auto"></m-image>
        <m-custom-date class="py-2 max-w-40 mx-auto" ></m-custom-date>
        <m-description class="max-w-40 mx-auto text-xl py-3"></m-description>
        <m-metadata class="max-w-40 mx-auto"></m-metadata>
        <m-tags class="max-w-40 mx-auto"></m-tags>
    </article>
</template>

<script>
import MTitle from '@/components/items-shared/Title'
import MDescription from '@/components/items-shared/Description'
import MCaption from '@/components/items-shared/Caption'
import MMetadata from '@/components/items-shared/Metadata'
import MTags from '@/components/items-shared/Tags'
import MCustomDate from '@/components/items-shared/CustomDate'
import MImage from '@/components/items-shared/Image'

import { mapGetters, mapActions } from 'vuex'

export default { 
    props: [ 'item' ],
    components: {
        MTitle,
        MDescription,
        MCaption,
        MImage,
        MMetadata,
        MTags,
        MCustomDate
    },
    created() {

    },
    computed: {
        ...mapGetters('items', [
            'editItem',
            'isEditing'
        ])
    },
    methods: {
        ...mapActions('items', [
            'setEditItem',
        ])
    }
}
</script>

<style>

</style>