<template>
    <header class="item-element-title w-75" v-if="isEditing">
        <b-form-group class="floating-label -mt-3 mb-0">
            <b-form-input id="title" v-model="editItem.title" placeholder="Add a title" class="input-dashed text-center">
            </b-form-input>
            <label class="sr-only" for="title"> Item Title</label>
        </b-form-group>
    </header>
    <header v-else class="pb-1">
        <h1 class="text-center">{{ current.title }}</h1>
    </header>
</template>

<script>
    import {
        mapGetters
    } from 'vuex'

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
    }

    .input-dashed {
        border-style: dashed !important
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter,
    .fade-leave-to

    /* .fade-leave-active below version 2.1.8 */
        {
        opacity: 0;
    }
</style>