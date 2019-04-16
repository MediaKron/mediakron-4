<template>
    <header class="item-element-title w-75" v-if="isEditing">
            <b-input-group>
             <b-form-input id="title" v-model="editItem.title" placeholder="Add a title" class="border-dashed text-black text-4xl"></b-form-input>
            <b-input-group-text for="title" slot="append" tag="label" class="items-center flex-col align text-sm bg-white w-24 border-dashed">
                <span class="font-bold">Item Title</span>
            </b-input-group-text>
        </b-input-group>
               
    </header>
    <header v-else>
        <h1 class="item-title">{{ first.title }}</h1>
    </header>
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

<style>
    .item-element-title #title {
       font-size: 2rem; 
       font-weight: 500;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>