<template>
    <div>
        <div class="item-element-source" v-if="isEditing">
            <b-button v-b-toggle.sourceCollapse variant="outline-dark" class="mb-3 text-black w-100 border-dashed text-left">
                 <span class="when-opened"><span class="sr-only">Close</span><font-awesome-icon icon="caret-down" /> </span> <span class="when-closed"><span class="sr-only">Open</span><font-awesome-icon icon="caret-down" /> </span> Source
           </b-button>
        <b-collapse id="sourceCollapse" >
            <b-form-group class="">
                <label for="reference">Reference</label>
                <b-form-input id="reference" v-model="editItem.reference" placeholder="Provide a refference/citation for this item" ></b-form-input>
                <label for="referenceUrl">Url</label>
                <b-form-input id="referenceUrl" v-model="editItem.referenceUrl" placeholder="http://www..." ></b-form-input>
            </b-form-group>
        </b-collapse>
        </div>
        <div v-else>
            <h1>Source</h1>
            <h2>{{ first.title }}</h2>
        </div>
    </div>
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

