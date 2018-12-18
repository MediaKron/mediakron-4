<template>
    <div>
        <b-nav vertical class="w-25">
            <b-nav-item active>Admin Menu</b-nav-item>
            <b-nav-item>Options</b-nav-item>
            <b-nav-item>More options</b-nav-item>
            <b-nav-item disabled>Disabled</b-nav-item>
        </b-nav>

        <section id="settings-context" class="w-75">
            <router-view></router-view>
        </section>
    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
