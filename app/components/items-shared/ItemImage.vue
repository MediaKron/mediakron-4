<template>
    <div class="item-element-image" v-if="isEditing">
        
    </div>
    <div v-else>
        <h2>{{ editItem.image }}</h2>
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

