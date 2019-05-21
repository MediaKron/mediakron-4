<template>
    <div class="item-element-caption flex" v-if="isEditing">
            <b-form-group class="floating-label flex-1">
              <b-form-textarea id="caption" v-model="editItem.caption" placeholder="Add a caption" rows="1"
                max-rows="100" class="input-dashed text-black"></b-form-textarea>
             <label for="caption"> Caption <b-button v-b-modal.help-caption variant="link" size="sm" class="text-black pl-1">
                    <font-awesome-icon icon="question-circle"/> <span class="sr-only"> About Captions</span></b-button></label>
            </b-form-group>

        <!-- Help Modal Window -->
        <b-modal id="help-caption" centered title="About Captions">
            <p>A caption is a short description or subtitle that provides an introductory or supplementary
                statement about a content item. It usually displays just below the title at the top of the page.<p>
                    <p>Captions are meant to be one or two sentences, so if you need to include more descriptive
                        information with an item, the "Description" field provides room for more text. </p>
        </b-modal>

    </div>
    <div v-else>
        <p v-html="current.caption"></p>
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