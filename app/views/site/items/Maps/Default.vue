<template>
    <article class="w-100">
        <m-title class="px-4"></m-title>
        <div class="map-container relative">
            <m-map class="mx-4"></m-map>
            <aside class="absolute right-0 top-0 px-3 bg-white mr-3 border">
                <m-description></m-description>
                <m-caption></m-caption>
                <m-metadata></m-metadata>
                <m-tags></m-tags>
            </aside>
        </div>
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
import MMap from '@/components/items-shared/Map'

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
        MCustomDate,
        MMap
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
