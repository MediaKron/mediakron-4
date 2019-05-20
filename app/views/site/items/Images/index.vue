<template>
    <div>
        <div v-if="isEditing" class="fixed flex justify-center items-center top-0 left-0 w-full bg-light z-10 p-2 text-center shadow">
            
            <b-button class="uppercase mr-2" variant="primary" @click="saveClicked">
                <font-awesome-icon icon="check" class="" /> <span class="ml-1">Save </span>
            </b-button>
            <b-button class="uppercase " variant="outline-dark">
                <font-awesome-icon icon="times" /> <span class="ml-1">Cancel</span>
            </b-button>
        </div>
        <component :is="component" :item="item" />
        <div class="right-0 top-0 fixed mr-4 mt-20 flex flex-column ">
            <b-button v-if="!isEditing"
                class="uppercase mb-2 flex flex-column items-center bg-light border-none item-button "
                variant="outline-dark" size="sm" @click="editClicked">
                <font-awesome-icon icon="edit" class="text-lg mt-1" /> <span class="text-xs mt-1">Edit</span></b-button>

            <m-options v-if="!isEditing"></m-options>
        </div>

    </div>
</template>

<script>
    import Default from './Default'
    import editable from '~/components/mixins/editable';
    import MOptions from '@/components/items-shared/Options'
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    export default {
        components: {
            MOptions
        },
        mixins: [editable],
        props: ['item'],
        methods: {},
        mounted() {},
        computed: {
            component() {
                switch (this.item.template) {
                    default:
                        return Default;
                }

            },
        }
    }
</script>

<style>
    .btn.item-button {
        padding-left: .5rem;
        padding-right: .5rem;
    }
</style>