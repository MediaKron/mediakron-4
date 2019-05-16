<template>
    <div class="folder-list mt-3">
        <ul class="dragon" v-for="(child, index) in this.children" :key="index" :model="dragonDrop">
            <li class="list-none border-gray-100">
                <font-awesome-icon icon="grip-lines" /> 
                <b-img slot="aside" src="https://picsum.photos/40?image=342" fluid alt="Responsive image" class="mx-2"/>
                <span class="font-bold">{{ child.title }} </span>
                <b-button variant="danger" size="sm"><font-awesome-icon icon="window-close" /><span class="sr-only">Remove</span> </b-button>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DragonDrop from 'drag-on-drop';

export default {
    data() {
        return {
            image: 'https://picsum.photos/300?image=342',
        }
    },
    computed: {
        children() {
            return this.current.children
        },
        ...mapGetters('items', [
            'editItem',
            'isEditing',
            'current'
        ])
    },
    mounted(){
        dragonDrop: new DragonDrop(this.dragon)
    },
    updated(){
        dragonDrop.initElements(this.dragon);
    },
}
</script>