<template>
    <div class="item-element-tags" v-if="isEditing">
        <b-button @click="isEditingTags=!isEditingTags" v-b-toggle.tagsCollapse variant="outline-dark" class="mb-3 text-black w-100 border-dashed text-left"> 
            <span class="when-opened"><span class="sr-only">Close</span><font-awesome-icon icon="caret-down" /> </span> <span class="when-closed"><span class="sr-only">Open</span><font-awesome-icon icon="caret-down" /> </span> Tags
        </b-button>
        <b-collapse id="tagsCollapse" >
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
                <li v-for="tag in first.tags">{{ tag.id }} - {{ tag.title }} </li>
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

