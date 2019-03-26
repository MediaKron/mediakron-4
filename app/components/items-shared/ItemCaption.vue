<template>
     <div class="item-element-caption" v-if="isEditing">
         <b-form-group class="floating-label">
            <b-form-textarea id="caption" v-model="editItem.caption" placeholder="Add a caption"></b-form-textarea>
            <label for="caption">Caption </label>
            <div class="help">
                <b-button v-b-modal.help-caption variant="link" class="text-sm px-0 text-black"><font-awesome-icon icon="question-circle"/> <span> About Captions</span></b-button>
                <!-- Help Modal Window -->
                <b-modal id="help-caption" centered title="About Captions">
                    <p>A caption is a short description or subtitle that provides an introductory or supplementary statement about a content item. It usually displays just below the title at the top of the page.<p>
                    <p>Captions are meant to be one or two sentences, so if you need to include more descriptive information with an item, the "Description" field provides room for more text. </p>  
                </b-modal>
            </div>
        </b-form-group>
        
    </div>
    <div v-else>
        <p v-html="first.caption"></p>
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

