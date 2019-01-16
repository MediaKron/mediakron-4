<template>
<div class="menus">
        <b-nav pills class="mb-4">
            <b-nav-item :to="basePath + '/options/people'"> Manage</b-nav-item>
            <b-nav-item :to="basePath + '/options/people/add'"><font-awesome-icon icon="user-plus"/> Add People</b-nav-item>
            <b-nav-item :to="basePath + '/options/people/groups'"><font-awesome-icon icon="users"/> Groups</b-nav-item>
        </b-nav>
        <header>
            <h1 class="line-behind heading-nudge-up mb-4"> People</h1>
        </header>

    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    components: {

  },
      computed:{
        ...mapGetters('sites', [
            'basePath'
        ]),
    },
};
</script>

<style>

</style>
