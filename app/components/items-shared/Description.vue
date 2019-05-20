<template>
    <div v-if="isEditing" class="flex justify-center">
        <b-form-group class="floating-label flex-1 mb-2">
            <b-form-textarea id="description" v-model="editItem.description" placeholder="Add a description" rows="2"
                max-rows="100" class="input-dashed text-black"></b-form-textarea>
            <label for="Description" class="text-base"> Description</label>
        </b-form-group>
        <div class="items-center align text-sm pl-2">
            <b-button v-b-modal.help-description variant="link" size="sm" class="pl-1">
                <font-awesome-icon icon="question-circle" class="text-black" /> <span class="sr-only"> About
                    Descriptions</span></b-button>
        </div>
        <!-- Help Modal Window -->
        <b-modal id="help-description" centered title="About Descriptions">
            <p> The description field is the the main explanatory text for a content item.</p>
            <p>By default it displays below items, but you can also choose to have it appear next to an item using the
                "Widget Display Options" toward the bottom of the edit form.</p>
        </b-modal>
    </div>
    <div v-else>
        <p v-html="current.description"></p>
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
                'current'
            ])
        }
    }
</script>