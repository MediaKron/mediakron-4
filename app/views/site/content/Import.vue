<template>
    <div class="content min-h-screen w-full lg:static lg:max-h-full max-w-6xl mx-auto lg:overflow-visible ">

        <header class="line-behind mb-4 mt-4">
            <h1>Import</h1>
        </header>

        <div class="pb-2">


    </div>
     </div>

</template>

<script>
    import Vue from 'vue';
    import {
        mapGetters,
        mapActions
    } from 'vuex';
    import Loader from '@/components/Loader';
    import Multiselect from 'vue-multiselect'
    export default Vue.extend({
        components: {
            Loader,
            Multiselect
        },
        computed: {
            ...mapGetters('sites', [
                'siteIsLoading',
                'siteIsLoaded',
                'basePath',
                'currentSite'
            ]),
            ...mapGetters('items', [
                'listIsLoading',
                'listIsLoaded',
                'items',
                'currentPage',
                'totalItems',
                'lastPage'
            ]),
        },

        methods: {
            linkGen(pageNum) {
                return '/' + this.currentSite.url + '/content/alltable/' + pageNum
            },
            ...mapActions('items', [
                'routeLoad'
            ]),
        },
        data() {
            return {
                fields: {
                    title: {
                        label: "Title",
                        sortable: true
                    },
                    type: {
                        label: "Type",
                        sortable: true
                    },
                    author: {
                        label: "Author",
                        sortable: true
                    },
                    updated_at: {
                        label: "Updated",
                        sortable: true
                    },
                    details: {
                        label: "Details",
                        sortable: false
                    },
                    status: {
                        label: "Status",
                        sortable: false
                    },
                    select: {
                        label: "Select",
                        sortable: false,
                        class: 'text-center'
                    },
                },
                filter: null,
                isBusy: false,
                selectAll: false,
                value: {
                    name: 'Authors',
                    language: 'JavaScript'
                },
                options: [{
                        name: 'Tim Lindgren',
                        language: 'JavaScript'
                    },
                    {
                        name: 'Jamie Walker',
                        language: 'Ruby'
                    },
                    {
                        name: 'Brad Mering',
                        language: 'Ruby'
                    },
                    {
                        name: 'Joe Smith',
                        language: 'PHP'
                    },
                    {
                        name: 'Sally',
                        language: 'Elixir'
                    }
                ]
            
            }

        },
        watch: {
            '$route.params.page': function (page) {
                this.routeLoad({
                    to: this.$route
                });
            }
        },
        mounted() {
            this.routeLoad({
                to: this.$route,
                site: this.currentSite
            });
        }
    });
</script>

<style>
    .thumb {
        width: 75px;
        height: 75px;
    }

    .content .add-content-btn {
        background-color: #0d5e93;
        border-color: #0d5e93;
    }

    .content .multiselect__tags {
        border:none;
        padding-top:2px;
        padding-bottom:0;
        min-height:0 !important;
        margin-left:-1rem;
        padding-right: 32px;
    }
     .content .multiselect,
     .content .multiselect__select {
         min-height:0 !important
    }

     .content .multiselect__select {
         height: 1.5rem; 
     }

    .content .multiselect__single {
        margin-bottom:0;
    }
</style>