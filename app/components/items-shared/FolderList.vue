<template>
    <div class="folder-list mt-3"> 
        <article class="mb-4" v-for="(child, index) in children" :key="index">
            <b-media>
                <b-img slot="aside" src="https://picsum.photos/75?image=342" fluid alt="Responsive image" />
                <h2>{{ child.title }}</h2>
            </b-media>
        </article>
    </div>
</template>

<script>
export default {
    props: [ 'children' ],
    data() {
        return {
            image: 'https://picsum.photos/300?image=342',
        }
    }
}
</script>
