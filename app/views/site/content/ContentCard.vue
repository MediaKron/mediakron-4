<template>
<div>
    <b-card-group deck class="flex-wrap">
        <b-card title="Title"
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
    import { mapActions, mapState, mapGetters } from "vuex";
    import Loader from '@/components/Loader';
    export default {
        components:{
            Loader
        },
        data() {
            return {
                // Note 'isActive' is left out and will not appear in the rendered table
                fields: {
                    id: {
                        label: "ID",
                        sortable: true
                    },
                    title: {
                        label: "Item Name",
                        sortable: true
                    },
                    uri: {
                        label: "uri",
                        sortable: true
                    },
                    published: {
                        label: "Published",
                        sortable: false
                    }

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
                }
            };
        },
        props: ['item'],
        computed: {
            ...mapGetters("items", ["listIsLoading", "listIsLoaded", "items", 'currentPage', "totalItems", "lastPage"]),
            ...mapState("items", ["pagination"]),
        },
        methods: {

        },
        watch: {
            '$route.params.page': function (page) {
                this.routeLoad({to: this.$route});
            }
        },
        mounted() {
            console.log(this);
            /* this.routeLoad({to: this.$route}); */
        }
    };

</script>

<style scoped>

.card-deck .card {
    flex: 0 0 20%;
    margin: 0 .5rem 1rem .5rem;
}

</style>
