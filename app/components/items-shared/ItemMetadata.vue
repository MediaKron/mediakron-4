<template>
    <div class="item-element-metadata" v-if="isEditing">
        <b-form-group class="floating-label">
            <b-form-input id="title" v-model="editItem.title" placeholder="Add a title" ></b-form-input>
            <label for="title">Title</label>
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

