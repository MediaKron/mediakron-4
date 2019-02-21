<template>
    <div class="item-element-tags" v-if="isEditing">
        
    </div>
    <div v-else>
        <h2>{{ editItem.tags }}</h2>
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

