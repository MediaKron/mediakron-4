<template>
    <div>
        <b-form class="container">
            <b-form-group v-if=isEditing
                label="Edit title"
                label-for="title">
                <b-input v-if="isEditing" id="title" :value="item.title"></b-input>
            </b-form-group>
            <div v-else>
                <div>{{ item.title }}</div>
            </div>
            <b-form-group>

            </b-form-group>
        </b-form>
    </div>
</template>

<script>
export default {
    props: [ 'item', 'isEditing' ],
    data() {
        return {

        }
    }
}
</script>

<style>

</style>
