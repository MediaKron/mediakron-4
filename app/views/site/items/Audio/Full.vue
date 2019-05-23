<template>
  <article class="container">
       <m-title class="max-w-2xl mx-auto"></m-title>
        <m-caption class="py-2 max-w-2xl mx-auto" ></m-caption>
        <m-audio></m-audio>
        <m-custom-date class="max-w-2xl mx-auto" ></m-custom-date>
        <m-description class="max-w-2xl mx-auto text-xl pb-3"></m-description>
        <m-source class="max-w-2xl mx-auto text-xl"></m-source>
        <m-metadata class="max-w-2xl mx-auto"></m-metadata>
        <m-tags class="max-w-2xl mx-auto"></m-tags>
        <m-transcript class="max-w-2xl mx-auto text-xl"></m-transcript>

   </article>
</template>

<script>
import Title from '@/components/items-shared/Title'
import Description from '@/components/items-shared/Description'
import Caption from '@/components/items-shared/Caption'
import Audio from '@/components/items-shared/Audio'
import { mapActions, mapGetters } from 'vuex'

export default {
    props: [ 'item', 'isEditing' ],
    components: {
        Title,
        Description,
        Caption,
        Audio
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
