<template>
    <article class="container">
        <m-title></m-title>
        <m-description></m-description>
        <m-caption></m-caption>
        <m-metadata></m-metadata>
        <m-tags></m-tags>
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
