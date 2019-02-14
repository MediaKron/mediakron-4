<template>
    <div>Mediakron Site Item {{ site }} {{ first }} {{ second }} {{ third }}</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
export default {
    props:[ 
        'site', 
        'first' , 
        'second', 
        'third' 
    ],

    created(){
        // go fetch the items

    }

}
</script>

<style>

</style>
