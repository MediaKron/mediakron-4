<template>
    <div class="folder-list mt-3">
        <h1>Child items to organize:</h1>
        <ul class="dragon" v-for="(child, index) in children" :key="index">
            <li>
                <button type='button' aria-label='Reorder' />
                <span>Item 1</span>
            </li>
            <li>
                <button type='button' aria-label='Reorder' />
                <span>Item 2</span>
            </li>
        </ul>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vddl from 'vddl';


export default {
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