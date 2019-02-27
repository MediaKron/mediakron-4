<template>
     <div class="item-element-caption" v-if="isEditing">
         <b-form-group class="floating-label">
            <b-form-textarea id="caption" v-model="editItem.caption"     placeholder="Add a caption"></b-form-textarea>
            <label for="caption">Caption</label>
        </b-form-group>
    </div>
    <div v-else>
        <p>{{ editItem.caption }}</p>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters('items', [
            'editItem',
            'isEditing'
        ])
    }
}
</script>

