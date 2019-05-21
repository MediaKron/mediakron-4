<template>
    <header class="item-element-title w-75" v-if="isEditing">
            <b-form-group class="floating-label">
             <b-form-input id="title" v-model="editItem.title" placeholder="Add a title" class="input-dashed"></b-form-input>
             <label for="title"> Item Title</label>
            </b-form-group>
               
    </header>
    <header v-else>
        <h1 class="item-title">{{ current.title }}</h1>
    </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters('items', [
            'editItem',
            'isEditing',
            'current'
        ])
    }
}
</script>

<style>
    .item-element-title #title {
    font-size: 2.5rem; 
    font-weight: 700;
    border:none;
    border-style: none !important;
    border-bottom: 1px solid #565656 !important;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding-left:0;
    }

    .input-dashed {
        border-style:dashed !important 
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>