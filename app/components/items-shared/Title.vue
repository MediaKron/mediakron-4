<template>
    <header class="item-element-title w-75" v-if="isEditing">
           
            <b-form-group class="floating-label mt-4">
             <b-form-textarea id="title" v-model="editItem.title" placeholder="Add a title" class="input-dashed" rows="1"
                max-rows="100"></b-form-textarea>
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
       font-size: 2rem; 
       font-weight: 500;
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