<template>
    <div class="folder-list mt-3">
        <div class="item-element-caption" v-if="isEditing">

            <div class="flex mb-3">
                <div>
                    <b-button class="mr-2" variant="outline-dark" v-b-modal.organize-modal><font-awesome-icon icon="arrows-alt-v" /> Organize Items</b-button>
                    <!-- Modal Component -->
                    <b-modal size="lg" centered lazy id="organize-modal" ok-title="Save" title="Organize Items">
                        <Organize></Organize>
                    </b-modal>
                </div>

                <div>
                    <b-dropdown id="add-items" class="mr-2" text="Add Items" variant="outline-dark">
                        <template slot="button-content">
                             <font-awesome-icon icon="plus" />  Add Items
                        </template>
                        <b-dropdown-item >Add New</b-dropdown-item>
                        <b-dropdown-item v-b-modal.addexisting-modal >Add Existing</b-dropdown-item>
                    </b-dropdown>

                    <b-modal size="lg" centered lazy id="addexisting-modal" title="Add Existing">
                        <AddExisting></AddExisting>
                    </b-modal>
                </div>

                <div>
                    <b-button class="mr-2" variant="outline-dark" v-b-modal.layout-modal><font-awesome-icon icon="paint-brush" />  Change Layout</b-button>
                    <!-- Modal Component -->
                    <b-modal size="lg" centered lazy id="layout-modal" title="Change Layout">
                        [list of layout options]
                    </b-modal>
                </div>
            </div>

            <div class="mb-4" v-for="(child, index) in children" :key="index">
                <b-media>
                    <b-img slot="aside" src="https://picsum.photos/75?image=342" fluid alt="Responsive image" />
                    <h2><a :href="first.uri + '/' + child.uri">{{ child.title }}</a></h2>
                </b-media>
            </div>

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
    import {
        mapGetters
    } from 'vuex';
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