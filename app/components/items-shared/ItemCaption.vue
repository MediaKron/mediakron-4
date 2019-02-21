<template>
     <div v-if="isEditing">
        <b-form-group
            label="Edit Caption"
            label-for="caption">
            <b-form-input id="caption" v-model="editItem.caption" :rows="3"></b-form-input>
        </b-form-group>
    </div>
    <div v-else>
        <p>{{ editItem.caption }}</p>
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

