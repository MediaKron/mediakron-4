<template>
<div> 
        <b-card 
                :img-src="selectedImage"
                img-alt="Img"
                img-top>
            <h3><router-link :to="item.url()">{{ item.title }}</router-link></h3>
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
    //import { mapActions, mapState, mapGetters } from "vuex";
    //import Loader from '@/components/Loader';
    export default {
        data() {
            return {
                // Note 'isActive' is left out and will not appear in the rendered table
                    /*
                    id: null,
                    version: 0,
                    created: 0,
                    changed: 0,
                    published: true,
                    archived: false,
                    user: {},
                    template: 'default',
                    options: {},
                    uri: false,
                    type: '',
                    title: '',
                    description: '',
                    body: '',
                    caption: '',
                    transcript: '',
                    image: '',
                    time: false,
                    */
            };
        },
        props: [ 'item' ], // Use this to get the item dets
        computed: {
            //...mapGetters("items", ["listIsLoading", "listIsLoaded", "items", 'currentPage', "totalItems", "lastPage"]), nothing to get ffrom the store here
            //...mapState("items", ["pagination"]),  Don't need pagination on the card level
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
                //this.routeLoad({to: this.$route}); Not needed because this comes from the parent
            }
        },
        mounted() {
            // console.log(this.item);
            // console.log(this.item.created);
            const idx = Math.floor(Math.random() * 100);
            // console.log(idx);
        }
    };

</script>

<style scoped>

.card-deck .card {
    flex: 0 0 20%;
    margin: 0 .5rem 1rem .5rem;
    max-width: 300px;
}

</style>
