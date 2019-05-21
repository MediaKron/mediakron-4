<template>
     <div class="item-element-transcript flex" v-if="isEditing">
        <b-form-group class="floating-label flex-1">
            <b-form-textarea id="transcript" v-model="editItem.transcript" placeholder="Add a transcript" rows="2"
                max-rows="100" class="input-dashed text-black"></b-form-textarea>
            <label for="transcript" class="text-base"> Transcript  <b-button v-b-modal.help-transcript variant="link" class="pl-1">
                <font-awesome-icon icon="question-circle" class="text-mk-gray-1" /> <span class="sr-only"> About
                    Transcripts</span></b-button></label>
        </b-form-group>
    </div>
    <div v-else>
        <p>{{ current.transcript }}</p>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

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

