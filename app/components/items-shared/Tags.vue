<template>
    <div class="item-element-tags" v-if="isEditing" v-bind:class="{ isVisible: 'NewClass' }">
        <b-button @click="isEditingTags=!isEditingTags" v-b-toggle.tagsCollapse class="mb-3"> {{ tagsButton }}</b-button>
        <b-collapse id="tagsCollapse" @show="collapseShow">
            <b-form-group class="">
                <label for="tag_names">Create tags</label>
                <multiselect 
                    v-model="editItem.tags" 
                    tag-placeholder="Add this as new tag" 
                    placeholder="Search or add a tag" 
                    label="title" 
                    track-by="id" 
                    :options="tags"
                    :multiple="true" 
                    :taggable="true" 
                    @tag="addTag"></multiselect>

            </b-form-group>
        </b-collapse>
    </div>
    <div v-else>
        <div v-if="first.tags.length > 0">
            <h2>Tags</h2>
            <ul>
                <li v-for="tag in first.tags" v-bind:key="tag.id">{{ tag.id }} - {{ tag.title }} </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BCollapse from "bootstrap-vue/src/components/collapse/collapse";
import Multiselect from 'vue-multiselect'

export default {
    components: {
        BCollapse, 
        Multiselect
    },
    data () {
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
        collapseShow(){
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
        tagsButton(){
                if (this.isEditing && this.isEditingTags) {
                    return 'Collapse Tags'
                }
                    return 'Edit Tags'


        },
        ...mapGetters('items', [
            'editItem',
            'isEditing',
            'first'
        ]),
        ...mapGetters('items', [
            'tags'
        ]),
    },
    mounted(){
            this.getTags()
    }

}
</script>

