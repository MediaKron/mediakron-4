<template>
     <div v-if="isEditing">
        <b-form-group
             class="floating-label">
            <b-form-textarea id="description" v-model="editItem.description" placeholder="Add a description"></b-form-textarea>
             <label for="description">Description</label>
             <div class="help">
                <b-button v-b-modal.help-description variant="link" class="text-sm px-0 text-black"><font-awesome-icon icon="question-circle"/> <span> About Descriptions</span></b-button>
                <!-- Help Modal Window -->
                <b-modal id="help-description" centered title="About Descriptions">
                    <p> The description field is the the main explanatory text for a content item.</p>
                    <p>By default it displays below items, but you can also choose to have it appear next to an item using the "Widget Display Options" toward the bottom of the edit form.</p>
                </b-modal>
             </div>
        </b-form-group>
    </div>
    <div v-else>
        <p v-html="first.description"></p>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

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


