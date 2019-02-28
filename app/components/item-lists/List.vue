<template>
    <div class="folder-list mt-3"> 
        <article class="mb-4" v-for="(child, index) in children" :key="index">
            <b-media>
                <b-img slot="aside" src="https://picsum.photos/75?image=342" fluid alt="Responsive image" />
                <h2><a :href="first.uri + '/' + child.uri">{{ child.title }}</a></h2>
            </b-media>
        </article>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            image: 'https://picsum.photos/300?image=342',
        }
    },
    computed: {
        children() {
            return this.first.children
        },
        ...mapGetters('items', ['first'])
    }
}
</script>
