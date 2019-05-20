<template>
    <div class="folder-list mt-3">
        <h1>Child items to organize:</h1>
        <draggable v-model="myArray">
            <transition-group>
                <div v-for="element in myArray" :key="element.id">
                    {{element.name}}
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
            return this.first.children
        },
        ...mapGetters('items', ['first'])
    },
    mounted() {


    },
    updated(){

    },

}
</script>