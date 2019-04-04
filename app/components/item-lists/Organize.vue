<template>
    <div class="folder-list mt-3"> 
        <b-button variation="dark" class="mr-auto">
               <font-awesome-icon icon="check" /> Save
            </b-button>
        <ul class="mb-4" v-for="(child, index) in children" :key="index">
            <li>
                <font-awesome-icon icon="grip-lines" /> 
                <b-img slot="aside" src="https://picsum.photos/75?image=342" fluid alt="Responsive image" />
                <span class="title">{{ child.title }} </span>
                <b-button><font-awesome-icon icon="window-close " />  Remove </b-button>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    }
}
</script>