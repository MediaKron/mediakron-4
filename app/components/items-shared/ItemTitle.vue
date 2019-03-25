<template>
    <header class="item-element-title w-75" v-if="isEditing">
               
        <b-form-group class="floating-label">
            <b-form-input id="title" v-model="editItem.title" placeholder="Add a title" ></b-form-input>
            <label for="title">Title</label>
        </b-form-group>
               
    </header>
    <header v-else>
        <h1>{{ first.title }}</h1>
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