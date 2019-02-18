<template>
    <b-card>
        <p class="card-text">
        <h3>Title:{{item.title}}</h3>
        <b-dropdown id="options" dropup text="Options" variant="outline-dark" size="sm" class="bg-light mr-2 mt-2">
            <b-dropdown-item href="#">Edit</b-dropdown-item>
            <b-dropdown-item href="#">Delete</b-dropdown-item>
            <b-dropdown-item href="#">Unpublish</b-dropdown-item>
            <b-dropdown-item href="#">Duplicate</b-dropdown-item>
            <b-dropdown-item href="#">Archive</b-dropdown-item>
            <b-dropdown-item href="#">Lock</b-dropdown-item>
        </b-dropdown>
        <b-dropdown id="view-in" dropup text="View In" variant="outline-dark" size="sm" class="bg-light mt-2">
            <b-dropdown-item href="#">Dummy</b-dropdown-item>
            <b-dropdown-item href="#">Dummy</b-dropdown-item>
            <b-dropdown-item href="#">Dummy</b-dropdown-item>
        </b-dropdown>
        <div slot="footer">
            <small class="text-muted">Last updated: {{item.updated_at}}</small>
        </div>
    </b-card>
</template>

<script>
    import { mapActions, mapState, mapGetters } from "vuex";
    export default {
        data() {
        },
            props: [ 'item' ]
        }
</script>
<style scoped>

</style>