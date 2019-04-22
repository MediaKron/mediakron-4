<template>
  <article class="container">
        <m-title></m-title>
        <m-caption></m-caption>
        <item-video></item-video>
       m-description></m-description>

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
