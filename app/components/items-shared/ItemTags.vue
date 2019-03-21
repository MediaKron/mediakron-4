<template>
    <div class="item-element-tags" v-if="isEditing">
        <b-button @click="isEditingTags=!isEditingTags" v-b-toggle.tagsCollapse class="mb-3"> {{ tagsButton }}</b-button>
        <b-collapse id="tagsCollapse" >
        <b-form-group class="">
            <label for="tag_names">Create tags</label>
            <b-form-input id="tag_names" v-model="editItem.tags.title" placeholder="Add tags. Example: One, Two, Three" ></b-form-input>
        </b-form-group>
        </b-collapse>
    </div>
    <div v-else>
        <h2>Tags</h2>
        <ul>
            <li v-for="tag in first.tags">{{ tag.id }} - {{ tag.title }} </li>
        </ul>
        {{ first.tags }}
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BCollapse from "bootstrap-vue/src/components/collapse/collapse";

export default {
    components: {BCollapse},
    computed: {
        tagsButton(){
            if (this.isEditingTags) {
                return 'Collapse Tags'
            }
            return 'Edit Tags'
        },
        ...mapGetters('items', [
            'editItem',
            'isEditing',
            'first'
        ])
    },
    data() {
        return {
            isEditingTags: false
        }
    },
    mounted(){
        console.log(this.first.tags)
    }
}
</script>

