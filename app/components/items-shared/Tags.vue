<template>
    <div class="item-element-tags mb-5" v-if="isEditing" v-bind:class="{ isVisible: 'NewClass' }">
        <div class="flex">
            <b-button v-b-toggle.tagsCollapse variant="outline-dark"
                class="b-3 text-black border-none text-left uppercase">
                <span class="when-opened"><span class="sr-only">Close</span>
                    <font-awesome-icon icon="caret-down" /> </span> <span class="when-closed"><span
                        class="sr-only">Open</span>
                    <font-awesome-icon icon="caret-right" /> </span> Tags
            </b-button>
            <div class="items-center align text-sm pl-2">
                <b-button v-b-modal.help-tags variant="link" size="sm" class="-ml-3">
                    <font-awesome-icon icon="question-circle" class="text-black" /> <span class="sr-only"> About
                        Tags</span></b-button>
            </div>
        </div>
        <b-collapse id="tagsCollapse" class="mt-4 mb-16">
            <b-form-group class="">
                <label class="sr-only" for="tag_names">Select or Create tags</label>
                <multiselect v-model="editItem.tags" tag-placeholder="Add this as new tag"
                    placeholder="Search or add a tag" label="title" track-by="id" :options="tags" :multiple="true"
                    :taggable="true" @tag="addTag"></multiselect>

            </b-form-group>
        </b-collapse>

    </div>
    <div v-else>
        <div v-if="current.tags.length > 0">
            <h2 class="text-lg">Tags</h2>
            <ul>
                <li v-for="tag in current.tags" v-bind:key="tag.id">{{ tag.id }} - {{ tag.title }} </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import BCollapse from "bootstrap-vue/src/components/collapse/collapse";
    import Multiselect from 'vue-multiselect'

    export default {
        components: {
            BCollapse,
            Multiselect
        },
        data() {
            return {
                isVisible: false,
                /*
                options: [
                    { title: 'Vue.js', id: '1' },
                    { title: 'Javascript', id: '2' },
                    { title: 'Open Source', id: '3' }
                ]
                */
                options: this.getTags(),
                isEditingTags: false
            }

        },
        methods: {
            collapseShow() {
                console.log('Shown')
                this.isVisible = true;
            },
            addTag(newTag) {
                const tag = {
                    title: newTag
                }
                //this.options.push(tag)
                this.editItem.tags.push(tag)
            },
            ...mapActions('items', [
                'getTags'
            ]),
        },
        computed: {
            tagsButton() {
                if (this.isEditing && this.isEditingTags) {
                    return 'Collapse Tags'
                }
                return 'Edit Tags'


            },
            ...mapGetters('items', [
                'editItem',
                'isEditing',
                'current'
            ]),
            ...mapGetters('items', [
                'tags'
            ]),
        },
        mounted() {
            this.getTags()
        }

    }
</script>

<style>
.item-element-tags .multiselect__tags {
    border-color: #616161;
    border-style: dashed;
}
</style>
