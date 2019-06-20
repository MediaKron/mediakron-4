<template>
    <div class="folder-list mt-3">
        <h1>Child items:</h1>
        <draggable v-model="children" @start="drag=true" @end="drag=false" :sortable="true" :move="checkMove">
            <transition-group>
                <div v-for="(child, index) in this.children" :key="index"><font-awesome-icon icon="arrows-alt-v" class="text-2xl mr-2"/>
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
        children: {
                get() {
                return this.current.children
            },
                set(value) {
                    console.log(value);
                //this.$store.commit('updateList', value)
            }


        },
        ...mapGetters('items', [
            'editItem',
            'isEditing',
            'current'
        ])
    },
    mounted() {


    },
    updated(){

    },
    methods: {
        checkMove: function(evt){
            return (evt.draggedContext.element.name!=='apple');
        }
    },

}
</script>