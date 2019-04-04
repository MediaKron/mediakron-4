<template>
    <div class="folder-list mt-3"> 
        <div class="item-element-caption" v-if="isEditing">

             <b-tabs content-class="mt-3">
                <b-tab title="View" active>
                    <article class="mb-4" v-for="(child, index) in children" :key="index">
                        <b-media>
                            <b-img slot="aside" src="https://picsum.photos/75?image=342" fluid alt="Responsive image" />
                            <h2><a :href="first.uri + '/' + child.uri">{{ child.title }}</a></h2>
                        </b-media>
                     </article>
                </b-tab>
                <b-tab title="Manage Items">
                     <Organize></Organize>
                </b-tab>
                <b-tab title="Add Existing Items">
                    <AddExisting></AddExisting>
                </b-tab>
                <b-tab title="Change Layout">
                    [list of layout options]
                </b-tab>
            </b-tabs>

            
        </div>
        <div v-else>
        <article class="mb-4" v-for="(child, index) in children" :key="index">
            <b-media>
                <b-img slot="aside" src="https://picsum.photos/75?image=342" fluid alt="Responsive image" />
                <h2><a :href="first.uri + '/' + child.uri">{{ child.title }}</a></h2>
            </b-media>
        </article>
    </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Organize from '@/components/item-lists/Organize';
import AddExisting from '@/views/site/content/AddExisting';
export default {
    components: {
        Organize,
        AddExisting
    },
    data() {
        return {
            image: 'https://picsum.photos/300?image=342',
        }
    },
    computed: {
        children() {
            return this.first.children
        },
         ...mapGetters('items', [
        'editItem',
        'isEditing',
        'first'
         ])
    },
}
</script>
