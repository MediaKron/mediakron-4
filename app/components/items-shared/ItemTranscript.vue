<template>
     <div class="item-element-transcript" v-if="isEditing">
        <b-form-group
             class="transcript floating-label">
            <b-form-textarea id="transcript" v-model="editItem.transcript" :rows="3" placeholder="Add a transcript"></b-form-textarea>
             <label for="transcript">Transcript</label>
        </b-form-group>
    </div>
    <div v-else>
        <p>{{ editItem.transcript }}</p>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props: [ 'isEditing' ],
    computed: {
        ...mapGetters('items', [
            'editItem',
        ])
    }
}
</script>

