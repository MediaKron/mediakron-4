<template>
     <div class="item-element-transcript" v-if="isEditing">
        <b-input-group>
            <b-input-group-text for="transcript" slot="prepend" tag="label" size="sm" class="items-center align text-sm bg-white w-auto border-dashed font-bold"> Transcript
                <b-button v-b-modal.help-description variant="link" size="sm" class="text-black pl-1" ><font-awesome-icon icon="question-circle" class="text-black" /> <span class="sr-only"> About Transcripts</span></b-button>
            </b-input-group-text>
            <b-form-textarea id="transcript" v-model="editItem.transcript" placeholder="Add a transcript" rows="2"
                max-rows="100" class="border-dashed text-black"></b-form-textarea>
            
        </b-input-group>
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

