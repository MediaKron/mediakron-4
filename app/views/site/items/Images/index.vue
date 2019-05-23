<template>
    <div>
        <component :is="component" :item="item" />
        <div class="right-0 top-0 fixed mr-6 mt-20 flex flex-column ">
            <b-button v-if="!isEditing" class="uppercase mb-2 flex flex-column items-center bg-light border-none item-button" variant="outline-dark" size="sm" @click="editClicked">
                <font-awesome-icon icon="edit" class="text-lg mt-1" /> <span class="text-xs mt-1">Edit</span>
            </b-button>
            <!-- <m-edit-button v-if="!isEditing" ></m-edit-button> -->
            <m-options v-if="!isEditing"></m-options>
            <m-save-button v-if="isEditing" ></m-save-button>
            <m-cancel-button v-if="isEditing" ></m-cancel-button>
        </div>

    </div>
</template>

<script>
    import Default from './Default'
    import editable from '~/components/mixins/editable'
    import MOptions from '@/components/items-shared/Options'
    import MSaveButton from '@/components/forms/SaveButton'
    import MEditButton from '@/components/forms/EditButton'
    import MCancelButton from '@/components/forms/CancelButton'
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    export default {
        components: {
            MOptions,
            MSaveButton,
            MEditButton,
            MCancelButton
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