<template>
    <div class="w-full mx-auto px-6 mt-16 ">
        <div class="flex">
            <article class="min-h-screen w-full lg:static lg:max-h-full lg:overflow-visible "> 
                <m-banner-full style="background-image: url('https://picsum.photos/1000/1000/?random')">
                    <m-title></m-title>
                </m-banner-full>
                <m-caption></m-caption>
                <m-list class="px-6 max-w-xl mx-auto"></m-list>
                <m-description></m-description>
            </article>
         </div>
    </div>
    
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
import MCollectionSidebar from '@/components/collections/CollectionSidebar'
import MBannerFull from '@/components/banners/BannerFull'

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
        MList,
        MCollectionSidebar,
        MBannerFull
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
