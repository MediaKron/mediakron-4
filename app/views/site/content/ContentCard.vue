<template>
<div>
    <b-card-group deck class="flex-wrap">
        <b-card :title="item.title"
                img-src="https://picsum.photos/300/300/?image=41"
                img-alt="Img"
                img-top>
            <p class="card-text">
            <b-dropdown id="ddown-dropup" dropup text="Option"  class="m-2">
                <b-dropdown-item href="#">Action</b-dropdown-item>
                <b-dropdown-item href="#">Another action</b-dropdown-item>
                <b-dropdown-item href="#">Something else here</b-dropdown-item>
            </b-dropdown>
            </p>
            <div slot="footer">
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
        </b-card>
    </b-card-group>
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
        methods: {

        },
        watch: {
            '$route.params.page': function (page) {
                //this.routeLoad({to: this.$route}); Not needed because this comes from the parent
            }
        },
        mounted() {
            console.log(this.item)
        }
    };

</script>

<style scoped>

.card-deck .card {
    flex: 0 0 20%;
    margin: 0 .5rem 1rem .5rem;
}

</style>
