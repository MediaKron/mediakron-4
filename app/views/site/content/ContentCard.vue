<template>
<div> 
    <b-card 
        :img-src="selectedImage"
        img-alt="Img"
        img-top>
        <h3><router-link :to="item.url()">{{ item.title }}</router-link> ({{ item.type }})</h3>
        <p class="card-text">
            <b-dropdown id="options" dropup text="Options" variant="outline-dark" size="sm" class="bg-light mr-2 mt-2">
                <b-dropdown-item href="#">Edit</b-dropdown-item>
                <b-dropdown-item href="#">Delete</b-dropdown-item>
                <b-dropdown-item href="#">Unpublish</b-dropdown-item>
                <b-dropdown-item href="#">Duplicate</b-dropdown-item>
                <b-dropdown-item href="#">Archive</b-dropdown-item>
                <b-dropdown-item href="#">Lock</b-dropdown-item>
            </b-dropdown>
                <b-dropdown id="view-in" dropup text="View In" variant="outline-dark" size="sm" class="bg-light mt-2">
                <b-dropdown-item href="#">Dummy</b-dropdown-item>
                <b-dropdown-item href="#">Dummy</b-dropdown-item>
                <b-dropdown-item href="#">Dummy</b-dropdown-item>
            </b-dropdown>
        </p>
        <div slot="footer">
            <small class="text-muted">Last updated: {{item.updated_at}}</small>
        </div>
    </b-card>
</div>
</template>

<script>

export default {
    data() {
        return {
            
        }
    },
    props: [ 'item' ], 
    computed: {

    },
    data () {
        return {
        images: [
            'https://picsum.photos/300?image=342',
            'https://picsum.photos/200?image=1074',
            'https://picsum.photos/200/300?image=446',
            'https://picsum.photos/300?image=973',
            'https://picsum.photos/200/300?image=459',
            'https://picsum.photos/200/300?image=1075',
            'https://picsum.photos/200?image=1077',
            'https://picsum.photos/200/300?image=352',
            'https://picsum.photos/200/300?image=323',
        ],
        selectedImage: '',
            id: this.item.id
        }
    },
    created () {
        const idx = Math.floor(Math.random() * this.images.length)
        this.selectedImage = this.images[idx]
    },
    methods: {

    },
    watch: {
        '$route.params.page': function (page) {

        }
    },
    mounted() {

        const idx = Math.floor(Math.random() * 100);
    }
}

</script>

<style scoped>

.card-deck .card {
    flex: 0 0 20%;
    margin: 0 .5rem 1rem .5rem;
    max-width: 300px;
}

</style>
