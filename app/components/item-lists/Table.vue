<template>
    <div class="folder-list mt-3"> 
       
        <b-table :items="children" :fields="fields" :filter="filter"
            @filtered="onFiltered" sortBy="updated_at" sort-desc="true" stacked="md">
            <template slot="title" slot-scope="items">
                <b-img v-bind="placeholderImage" blank-color="#777" alt="Placeholder Image" />
                <a :href="first.uri + '/' + child.uri">{{ child.title }}</a>
            </template>
            <template slot="type" slot-scope="items">
                {{ items.child.type}}
            </template>
        </b-table>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            image: 'https://picsum.photos/300?image=342',
            fields: {

                title: {
                    label: "Title",
                    sortable: true
                },
                type: {
                    label: "Type",
                    sortable: true
                },
                updated_at: {
                    label: "Updated",
                    sortable: true
                },
            },
        }
    },
    computed: {
        children() {
            return this.first.children
        },
        ...mapGetters('items', ['first'])
    },
    
}
</script>
