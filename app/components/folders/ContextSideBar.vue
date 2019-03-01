<template>
    <div>
        <h2>In <b-link :to=“second.uri”>{{ second.title }}</b-link></h2>
        <b-dropdown text="Contexts" variant="link" class="m-md-2" toggle-class="uppercase">
            <b-dropdown-item 
                v-for="(parent, index) in this.first.parents" 
                :key="index"
                :href="parent.uri">
                {{ parent.title }}
            </b-dropdown-item>
        </b-dropdown>
        <b-list-group>
            <b-list-group-item 
                v-for="(child, index) in parentChildren" 
                :key="index" 
                :href="child.uri" 
                :active="child.title == first.title">
                {{ child.title  }}
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    mounted() {
        console.log(Object.keys(this.third).length != 0)
    },
    computed: {
        parentChildren() {
            if (Object.keys(this.second).length != 0) return this.second.children
            else return []
        },
        ...mapGetters('items', [
            'first',
            'second',
            'third'
        ])
    }
}
</script>
