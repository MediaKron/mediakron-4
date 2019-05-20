<template>
    <div class="item-element-metadata mb-5" v-if="isEditing">
        <div class="flex">
            <b-button v-b-toggle.metadataCollapse variant="outline-dark"
                class="b-3 text-black border-none text-left uppercase">
                <span class="when-opened"><span class="sr-only">Close</span>
                    <font-awesome-icon icon="caret-down" /> </span> <span class="when-closed"><span
                        class="sr-only">Open</span>
                    <font-awesome-icon icon="caret-right" /> </span> Metadata
            </b-button>
            <div class="items-center align text-sm pl-2">
                <b-button v-b-modal.help-metadata variant="link" size="sm" class="-ml-3">
                    <font-awesome-icon icon="question-circle" class="text-black" /> <span class="sr-only"> About
                        Metadata</span></b-button>
            </div>
        </div>
        <b-collapse id="metadataCollapse" class="mt-4">
            <b-form-group class="floating-label">
                <b-form-input class="input-dashed" id="source" v-model="editItem.metadata.source" placeholder="Add a source"></b-form-input>
                 <label for="source">Source</label>
            </b-form-group>
            <b-form-group class="floating-label">
                <b-form-input class="input-dashed" id="citation" v-model="editItem.metadata.citation" placeholder="Add a citation">
                </b-form-input>
                 <label for="citation">Citation</label>
            </b-form-group>
            <b-form-group class="floating-label">
                <b-form-input class="input-dashed" id="description" v-model="editItem.metadata.description" placeholder="description">
                </b-form-input>
                 <label for="description">Description</label>
            </b-form-group>
            <b-form-group class="floating-label">
                <b-form-input class="input-dashed" id="published" v-model="editItem.metadata.published" placeholder="Add a publisher">
                </b-form-input>
                 <label for="published">Published</label>
            </b-form-group>
            <b-form-group class="floating-label">
                <b-form-input class="input-dashed" id="creator" v-model="editItem.metadata.creator" placeholder="Add a creator">
                </b-form-input>
                 <label for="creator">Creator</label>
            </b-form-group>
            <b-form-group class="floating-label">
                <b-form-input class="input-dashed" id="publisher" v-model="editItem.metadata.publisher" placeholder="Add a publisher">
                </b-form-input>
                 <label for="publisher">Publisher</label>
            </b-form-group>
            <b-form-group class="floating-label">
                <b-form-input class="input-dashed" id="contributor" v-model="editItem.metadata.contributor" placeholder="Add a contributor">
                </b-form-input>
                 <label for="contributor">Contributor</label>
            </b-form-group>
            <b-form-group class="floating-label">
                <b-form-input class="input-dashed" id="format" v-model="editItem.metadata.format" placeholder="description"></b-form-input>
                <label for="format">Format</label>
            </b-form-group>
            <b-form-group class="floating-label">
                <b-form-input class="input-dashed" id="identifier" v-model="editItem.metadata.identifier" placeholder="Add a identifier">
                </b-form-input>
                 <label for="identifier">Identifier</label>
            </b-form-group>
            <b-form-group class="floating-label">
                <b-form-input class="input-dashed" id="language" v-model="editItem.metadata.language" placeholder="Add a language">
                </b-form-input>
                 <label for="language">Creator</label>
            </b-form-group>
            <b-form-group class="floating-label">
                <b-form-input class="input-dashed" id="format" v-model="editItem.metadata.relation" placeholder="Add a relation">
                </b-form-input>
                 <label for="relation">Relation</label>
            </b-form-group>
            <b-form-group class="floating-label">
                <b-form-input class="input-dashed" id="coverage" v-model="editItem.metadata.coverage" placeholder="Add coverage">
                </b-form-input>
                 <label for="coverage">Coverage</label>
            </b-form-group>
            <b-form-group class="floating-label">
                <b-form-input class="input-dashed" id="rights" v-model="editItem.metadata.rights" placeholder="Add rights"></b-form-input>
                 <label for="rights">Rights</label>
            </b-form-group>

        </b-collapse>

    </div>
    <div v-else>
        <div v-if="metadata.id" class="my-4">
            <b-collapse id="urlCollapse" visible>
                <h2 class="text-lg">Metadata</h2>
                <ul>
                    <li v-for="(value, key) in metadata" v-bind:key="key">{{ key }} : {{ value }} </li>
                </ul>
            </b-collapse>
        </div>
    </div>
</template>

<script>
    import {
        mapGetters
    } from 'vuex'
    import BCollapse from "bootstrap-vue/src/components/collapse/collapse"

    export default {
        components: {
            BCollapse
        },
        computed: {
            metadata() {
                var cache = {};
                for (var key in this.current.metadata) {
                    if (this.current.metadata[key] != null) cache[key] = this.current.metadata[key];
                };
                return cache;
            },
            metadataButton() {
                if (this.isEditingMetadata) {
                    return 'Collapse Metadata'
                }
                return 'Edit Metadata'
            },
            ...mapGetters('items', [
                'editItem',
                'isEditing',
                'current',
                'itemIsLoaded'
            ])
        },
        data() {
            return {
                isEditingMetadata: false
            }
        },

        mounted() {

        }
    }
</script>