<template>
    <div class="folder-list mt-3">
        <div class="flex" v-if="isEditing">

            <div class="flex mb-3 justify-center">
                <b-button class="mr-2" variant="outline-dark" size="sm" v-b-modal.organize-modal>
                    <font-awesome-icon icon="arrows-alt-v" /> Organize</b-button>
                <!-- Modal Component -->
                <b-modal size="lg" centered lazy id="organize-modal" ok-title="Save" title="Organize Items">
                    <Organize></Organize>
                </b-modal>

                <b-dropdown id="add-items" size="sm" class="mr-2" text="Add Items" variant="outline-dark">
                    <template slot="button-content">
                        <font-awesome-icon icon="plus" /> Add
                    </template>
                    <b-dropdown-item v-b-modal.addnew-modal>Add New</b-dropdown-item>
                    <b-dropdown-item v-b-modal.addexisting-modal>Add Existing</b-dropdown-item>
                </b-dropdown>

                <b-modal size="lg" centered lazy id="addnew-modal" title="Add New Content" hide-footer>
                    <AddNew></AddNew>
                </b-modal>

                <b-modal size="lg" centered lazy id="addexisting-modal" title="Add Existing">
                    <AddExisting></AddExisting>
                </b-modal>

                <b-button class="mr-2" variant="outline-dark" size="sm" v-b-modal.layout-modal>
                    <font-awesome-icon icon="paint-brush" /> Layout</b-button>
                <!-- Modal Component -->
                <b-modal size="lg" centered lazy id="layout-modal" title="Change Layout">
                    [list of layout options]
                </b-modal>
            </div>
            <ul class="list-none pl-0">
                <li lass="mb-4" v-for="(child, index) in children" :key="index">
                    <b-media>
                        <!-- <b-img slot="aside" src="https://picsum.photos/75?image=342" fluid alt="Responsive image" /> -->
                        <h2><a :href="current.uri + '/' + child.uri">{{ child.title }}</a></h2>
                    </b-media>
                </li>
            </ul>
        </div>
        <div v-else>
            <ul class="list-none pl-0">
                <li class="mb-4" v-for="(child, index) in children" :key="index">
                    <b-media>
                        <!-- <b-img slot="aside" src="https://picsum.photos/75?image=342" fluid alt="Responsive image" /> -->
                        <h2><a :href="current.uri + '/' + child.uri">{{ child.title }}</a></h2>
                    </b-media>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    import {
        mapGetters
    } from 'vuex';
    import Organize from '@/components/item-lists/Organize';
    import AddExisting from '@/views/site/content/AddExisting';
    import AddNew from '@/components/item-lists/AddNew';
    export default {
        components: {
            Organize,
            AddExisting,
            AddNew
        },
        data() {
            return {
                image: 'https://picsum.photos/300?image=342',
            }
        },
        computed: {
            children() {
                return this.current.children
            },
            ...mapGetters('items', [
                'editItem',
                'isEditing',
                'current'
            ])
        },
    }
</script>

<style>
    .modal-2xl {
        max-width: 1280px !important;
    }

    .modal-2xl .modal-content {
        height: calc(100vh - 3.5rem);
    }

    .modal-full {
        max-width: calc(100% - 3.5rem) !important;
    }

    .modal-full .modal-content {
        height: calc(100vh - 3.5rem);
    }
</style>