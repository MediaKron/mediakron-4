<template>
    <div v-if="isEditing">
        <b-form-group
            label="Edit title"
            label-for="title">
            <b-form-input id="title" v-model="editItem.title"></b-form-input>
        </b-form-group>
    </div>
    <div v-else>
        <h2>{{ editItem.title }}</h2>
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

