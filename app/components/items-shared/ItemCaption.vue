<template>
    <div class="item-element-caption" v-if="isEditing">
        <b-input-group>
            <b-form-textarea id="caption" v-model="editItem.caption" placeholder="Add a caption" rows="2"
                max-rows="100" class="border-dashed text-black"></b-form-textarea>
            <b-input-group-text for="caption" slot="append" tag="label" class="items-center flex-col align text-sm bg-white w-24 border-dashed">
                <span class="font-bold">Caption</span>
                <b-button v-b-modal.help-caption variant="link" size="sm" class="text-black">
                    <font-awesome-icon icon="question-circle" /> <span class="sr-only"> About Captions</span></b-button>
            </b-input-group-text>
        </b-input-group>

        <!-- Help Modal Window -->
        <b-modal id="help-caption" centered title="About Captions">
            <p>A caption is a short description or subtitle that provides an introductory or supplementary
                statement about a content item. It usually displays just below the title at the top of the page.<p>
                    <p>Captions are meant to be one or two sentences, so if you need to include more descriptive
                        information with an item, the "Description" field provides room for more text. </p>
        </b-modal>

    </div>
    <div v-else>
        <p v-html="first.caption"></p>
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