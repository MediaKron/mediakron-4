<template>
    <div class="item-element-source mb-5" v-if="isEditing">
        <div class="flex">
            <b-button v-b-toggle.sourceCollapse variant="outline-dark"
                class="text-black border-none text-left uppercase">
                <span class="when-opened"><span class="sr-only">Close</span>
                    <font-awesome-icon icon="caret-down" /> </span> <span class="when-closed"><span
                        class="sr-only">Open</span>
                    <font-awesome-icon icon="caret-right" /> </span> Source
            </b-button>
            <div class="items-center align text-sm pl-2">
                <b-button v-b-modal.help-source variant="link" size="sm" class="-ml-3">
                    <font-awesome-icon icon="question-circle" class="text-black" /> <span class="sr-only"> About
                        Source Fields</span></b-button>
            </div>
        </div>
        <b-collapse id="sourceCollapse" class="mt-4">
            <b-form-group class="floating-label">
                <b-form-textarea class="input-dashed" id="reference" v-model="editItem.reference"
                    placeholder="Provide a refference/citation for this item" rows="2" max-rows="100"></b-form-textarea>
                <label class="text-base" for="reference">Reference</label>
            </b-form-group>
            <b-form-group class="floating-label">
                <b-form-textarea class="input-dashed" id="referenceUrl" v-model="editItem.referenceUrl"
                    placeholder="http://www..." rows="2" max-rows="100"></b-form-textarea>
                <label class="text-base" for="referenceUrl">Url</label>
            </b-form-group>
        </b-collapse>

    </div>
    <div v-else class="my-4">
        <h2 class="text-lg">Source</h2>
        {{ current.source }}
    </div>
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