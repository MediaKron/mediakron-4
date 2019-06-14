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
<!--
    <b-list-group  class="folder-list m-4 dragon" tag="ul">
        <b-list-group-item class="flex items-center cursor-move" tag="li" v-for="(child, index) in this.children" :key="index" :model="dragonDrop">
                <font-awesome-icon icon="arrows-alt-v" class="text-2xl mr-2"/> 
                <b-img slot="aside" src="https://picsum.photos/40?image=342" fluid alt="add alt tag" class="mx-2"/>
                <span class="font-bold mr-auto">{{ child.title }} </span>
        </b-list-group-item>
    </b-list-group >
-->

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
        ...mapGetters('items', [
            'editItem',
            'isEditing',
            'current'
        ])
    },
<<<<<<< HEAD
    mounted() {


    },
    updated(){

=======
    mounted(){
        dragonDrop: new DragonDrop(this.dragon)
    },
    updated(){
        dragonDrop.initElements(this.dragon);
>>>>>>> items
    },
}
</script>