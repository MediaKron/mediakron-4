<template>
    <div class="w-full mx-auto px-6 mt-16 ">
        <div class="flex">
            <aside id="sidebar" class="hidden min-w-64 max-w-xs lg:block pb-12">
                <div class="lg:relative lg:sticky top-20 border-t-0 border-l-0 border-b-0 border-r-2 border-grey border-solid mr-10 ">
                    <m-context-sidebar class="sticky?lg:h-(screen-32) overflow-y-auto pr-4"></m-context-sidebar>
                </div>
            </aside>
            <article class="min-h-screen w-full lg:static lg:max-h-full lg:overflow-visible "> 
                
                <m-title></m-title>
                <m-caption></m-caption>
                <m-list class="px-6 max-w-xl mx-auto"></m-list>
                <m-description></m-description>
                <m-metadata></m-metadata>
                <m-tags></m-tags>
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
import MContextSidebar from '@/components/folders/ContextSidebar'

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
        MContextSidebar
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
