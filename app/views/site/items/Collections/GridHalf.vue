<template>
    <article id="grid-half" >
        <!-- <m-banner-full :style="items.item.imageUrl('double')"> -->
        <m-banner-half style="background-image: url('https://picsum.photos/1000/1000/?random')">
            <m-title></m-title>
        </m-banner-half>
        <m-caption></m-caption>
        <m-grid></m-grid>
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

    import MGrid from '@/components/item-lists/Grid'
    import MCollectionSidebar from '@/components/collections/CollectionSidebar'
    import MBannerHalf from '@/components/banners/BannerHalf'

    import {
        mapGetters,
        mapActions
    } from 'vuex'

    export default {
        props: ['item', 'isEditing'],
        components: {
            MTitle,
            MDescription,
            MCaption,
            MImage,
            MMetadata,
            MTags,
            MCustomDate,
            MGrid,
            MBannerHalf,
            MCollectionSidebar
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
#grid-half #title {
    border-color:#fff;
}
</style>