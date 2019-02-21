<template>
     <div v-if="isEditing">
        <b-form-group
             class="floating-label">
            <b-form-textarea id="description" v-model="editItem.description" :rows="3" placeholder="Add a description"></b-form-textarea>
             <label for="description">Description</label>
        </b-form-group>


    </div>
    <div v-else>
        <p>{{ editItem.description }}</p>
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


