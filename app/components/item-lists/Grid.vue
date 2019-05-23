<template>
    <div class="folder-list mt-3">
        <div class="" v-if="isEditing">

           <div class="flex mb-3 justify-center">
                <div>
                    <b-button class="mr-2" size="sm" variant="outline-dark" v-b-modal.organize-modal>
                        <font-awesome-icon icon="arrows-alt-v" /> Organize</b-button>
                    <!-- Modal Component -->
                    <b-modal size="lg" centered lazy id="organize-modal" ok-title="Save" title="Organize Items">
                        <Organize></Organize>
                    </b-modal>
                </div>

                <div>
                    <b-dropdown id="add-items" size="sm" class="mr-2" text="Add Items" variant="outline-dark">
                        <template slot="button-content">
                            <font-awesome-icon icon="plus" /> Add
                        </template>
                        <b-dropdown-item v-b-modal.addnew-modal>Add New</b-dropdown-item>
                        <b-dropdown-item v-b-modal.addexisting-modal>Add Existing</b-dropdown-item>
                    </b-dropdown>

                    <b-modal size="lg" centered lazy id="addnew-modal" title="Add New Content" hide-footer >
                         <AddNew></AddNew>
                    </b-modal>

                    <b-modal size="lg" centered lazy id="addexisting-modal" title="Add Existing">
                        <AddExisting></AddExisting>
                    </b-modal>
                </div>

                <div>
                    <b-button class="mr-2" size="sm" variant="outline-dark" v-b-modal.layout-modal>
                        <font-awesome-icon icon="paint-brush" /> Layout</b-button>
                    <!-- Modal Component -->
                    <b-modal size="lg" centered lazy id="layout-modal" title="Change Layout">
                        [list of layout options]
                    </b-modal>
                </div>
            </div>

            <ul class="collection-grid mb-4">
                <li v-for="(child, index) in children" :key="index" class="collection-grid-item">
                    <b-img slot="aside" src="https://picsum.photos/75?image=342" fluid alt="Responsive image" />
                    <router-link :to="mLink(current.uri, child.uri)">{{ child.title }}</router-link>
                </li>
            </ul>

        </div>
        <div v-else>
        <ul class="collection-grid mb-4" >
                    <li v-for="(child, index) in children" :key="index" class="collection-grid-item">
                        <b-img slot="aside" src="https://picsum.photos/75?image=342" fluid alt="Responsive image" />
                        <router-link :to="mLink(current.uri, child.uri)">{{ child.title }}</router-link>
                        <!-- <a :href="current.uri + '/' + child.uri">{{ child.title }}</a> -->
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
        methods: {
            linkGen() {
                return '/' + this.child.uri
            },

        }
    }
</script>

<style >

.collection-grid {
    padding: 1em;
    margin-left: auto;
    margin-right: auto;
    max-width: 992px;
    display:flex;
    justify-content: center;
    align-items:stretch;
    flex-wrap:wrap;
    clear: both;
    text-align: center;
}

.collection-grid-item {
    transition: all 0.2s ease-in-out;
    flex:1 1 150px;
    align-self:flex-start;
    display: block;
    margin: 0.5em;
    list-style:none;
    max-width: 150px;
    }
    
.collection-grid-item:hover {
      opacity: .7;
    }
    
.collection-grid-item img {
     width: 100%;
     height: auto;
     box-shadow: 0 1px 3px rgba(0,0,0,.7);
   }


</style>
