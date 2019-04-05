<template>
    <div class="item-element-metadata" v-if="isEditing">
        <b-button @click="isEditingMetadata=!isEditingMetadata" v-b-toggle.metadataCollapse class="mb-3"> {{ metadataButton }}</b-button>
        <b-collapse id="metadataCollapse" >
            <b-form-group class="">
                <label for="source">Source</label>
                <b-form-input id="source" v-model="editItem.metadata.source" placeholder="Add a source" ></b-form-input>
            </b-form-group>
            <b-form-group class="">
                <label for="citation">Citation</label>
                <b-form-input id="citation" v-model="editItem.metadata.citation" placeholder="Add a citation" ></b-form-input>
            </b-form-group>
            <b-form-group class="">
                <label for="description">Description</label>
                <b-form-input id="description" v-model="editItem.metadata.description" placeholder="description" ></b-form-input>
            </b-form-group>
            <b-form-group class="">
                <label for="published">Published</label>
                <b-form-input id="published" v-model="editItem.metadata.published" placeholder="Add a publisher" ></b-form-input>
            </b-form-group>
            <b-form-group class="">
                <label for="creator">Creator</label>
                <b-form-input id="creator" v-model="editItem.metadata.creator" placeholder="Add a creator" ></b-form-input>
            </b-form-group>
            <b-form-group class="">
                <label for="publisher">Publisher</label>
                <b-form-input id="publisher" v-model="editItem.metadata.publisher" placeholder="Add a publisher" ></b-form-input>
            </b-form-group>
            <b-form-group class="">
                <label for="contributor">Contributor</label>
                <b-form-input id="contributor" v-model="editItem.metadata.contributor" placeholder="Add a contributor" ></b-form-input>
            </b-form-group>
            <b-form-group class="">
                <label for="format">Format</label>
                <b-form-input id="format" v-model="editItem.metadata.format" placeholder="description" ></b-form-input>
            </b-form-group>
            <b-form-group class="">
                <label for="identifier">Identifier</label>
                <b-form-input id="identifier" v-model="editItem.metadata.identifier" placeholder="Add a identifier" ></b-form-input>
            </b-form-group>
            <b-form-group class="">
                <label for="language">Creator</label>
                <b-form-input id="language" v-model="editItem.metadata.language" placeholder="Add a language" ></b-form-input>
            </b-form-group>

            <b-form-group class="">
                <label for="relation">Relation</label>
                <b-form-input id="format" v-model="editItem.metadata.relation" placeholder="Add a relation" ></b-form-input>
            </b-form-group>
            <b-form-group class="">
                <label for="coverage">Coverage</label>
                <b-form-input id="coverage" v-model="editItem.metadata.coverage" placeholder="Add coverage" ></b-form-input>
            </b-form-group>
            <b-form-group class="">
                <label for="rights">Rights</label>
                <b-form-input id="rights" v-model="editItem.metadata.rights" placeholder="Add rights" ></b-form-input>
            </b-form-group>

        </b-collapse>
    </div>
    <div v-else>
        <div v-if="first.metadata">
            <b-collapse id="urlCollapse" visible >
            <h2>Metadata</h2>
                <ul>
                    <li v-for="(value, key) in first.metadata" v-if="value">{{ key }} : {{ value }} </li>
                </ul>
            </b-collapse>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BCollapse from "bootstrap-vue/src/components/collapse/collapse"

export default {
    components: {BCollapse},
    computed: {
        metadataButton(){
            if (this.isEditingMetadata) {
                return 'Collapse Metadata'
            }
            return 'Edit Metadata'
        },
        ...mapGetters('items', [
            'editItem',
            'isEditing',
            'first'
        ])
    },
    data(){
        return {
            isEditingMetadata: false
        }
    },

    mounted(){

    }
}
</script>

