<template>
    <article class="mx-auto max-w-40"> 
        <m-title></m-title>
        <m-caption></m-caption>
        <m-list class="mt-10 mb-8"></m-list>
        <m-description></m-description>
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

import MList from '@/components/item-lists/List'

import { mapGetters, mapActions } from 'vuex'

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
        MList
    },
    data() {
        return {

        }
    },
    created() {

    },
    computed: {
        ...mapGetters('items', ['editItem'])
    },
    methods: {
        ...mapActions('items', ['setEditItem'])
    }
}
</script>

<style>

</style>
