<template>
    <div class="w-full mx-auto px-6 mt-16 ">
        <div class="flex">
            <aside id="sidebar" class="hidden min-w-64 max-w-xs lg:block pb-12">
                <div class="lg:relative lg:sticky top-20 border-t-0 border-l-0 border-b-0 border-r-2 border-grey border-solid mr-10 ">
                    <ContextSideBar class="sticky?lg:h-(screen-32) overflow-y-auto pr-4"></ContextSideBar>
                </div>
            </aside>
            <article class="px-6 min-h-screen w-full lg:static lg:max-h-full lg:overflow-visible max-w-xl mx-auto"> 
                <BannerHalf style="background-image: url('https://picsum.photos/1000/1000/?random')">
                    <ItemTitle></ItemTitle>
                </BannerHalf>
                <ItemCaption></ItemCaption>
                <List></List>
                <ItemDescription></ItemDescription>
            </article>
         </div>
    </div>
    
</template>

<script>
import ContextSideBar from '@/components/folders/ContextSideBar'
import ItemTitle from '@/components/items-shared/ItemTitle'
import BannerHalf from '@/components/banners/BannerHalf'
import ItemDescription from '@/components/items-shared/ItemDescription'
import ItemCaption from '@/components/items-shared/ItemCaption'
import List from '@/components/item-lists/List'

import { mapGetters, mapActions } from 'vuex'

export default {
    props: [ 'item', 'isEditing' ],
    components: {
        ItemTitle,
        BannerHalf,
        ItemDescription,
        ItemCaption,
        List,
        ContextSideBar
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
