<template>
    <div>
        <div class="item-element-source" v-if="isEditing">
            <b-form-group class="">
                <label for="reference">Reference</label>
                <b-form-input id="reference" v-model="editItem.reference" placeholder="Provide a refference/citation for this item" ></b-form-input>
                <label for="referenceUrl">Url</label>
                <b-form-input id="referenceUrl" v-model="editItem.referenceUrl" placeholder="http://www..." ></b-form-input>
            </b-form-group>
        </div>
        <div v-else>
            <h1>Custom Date</h1>
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