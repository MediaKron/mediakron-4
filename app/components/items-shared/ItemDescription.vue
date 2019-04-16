<template>
    <div v-if="isEditing">
        <b-input-group>
            <b-form-textarea id="description" v-model="editItem.description" placeholder="Add a description" rows="2"
                max-rows="100" class="border-dashed"></b-form-textarea>
            <b-input-group-text for="description" slot="append" tag="label" size="sm" class="items-center flex-col align text-sm bg-white w-24 border-dashed font-bold"> Description
                <b-button v-b-modal.help-description variant="link" size="sm"><font-awesome-icon icon="question-circle" class="text-black" /> <span class="sr-only"> About Descriptions</span></b-button>
            </b-input-group-text>
        </b-input-group>
        <!-- Help Modal Window -->
        <b-modal id="help-description" centered title="About Descriptions">
            <p> The description field is the the main explanatory text for a content item.</p>
            <p>By default it displays below items, but you can also choose to have it appear next to an item using the
                "Widget Display Options" toward the bottom of the edit form.</p>
        </b-modal>
    </div>
    <div v-else>
        <p v-html="first.description"></p>
    </div>
</template>

<script>
    import {
        mapGetters
    } from 'vuex'

    export default {
        computed: {
            ...mapGetters('items', [
                'editItem',
                'isEditing',
                'first'
            ])
        }
    }
</script>