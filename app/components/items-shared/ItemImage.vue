<template>
    <div class="item-element-image" v-if="isEditing">
        
    </div>
    <div v-else>
        <h2>{{ first.image }}</h2>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters('items', [
            'editItem',
            'isEditing',
            'first'
        ])
    }
}
</script>

