<template>
    <div class="folder-list mt-3">
        <h1>Child items to organize:</h1>
        <draggable v-model="children">
            <transition-group>
                <div v-for="(child, index) in this.children">
                    {{child.title}}
                </div>
            </transition-group>
        </draggable>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'


export default {
    components: {
        draggable

    },
    data() {
        return {
            image: 'https://picsum.photos/300?image=342',
        }
    },
    computed: {
        children() {
            return this.current.children
        },
        ...mapGetters('items', ['first'])
    },
    mounted() {


    },
    updated(){

    },

}
</script>