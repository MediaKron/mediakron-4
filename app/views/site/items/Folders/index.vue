<template>
    <div>
        <component :is="component" :item="item" :isEditing="isEditing"/>
    </div>
</template>

<script>
import Default from './Default'

export default {
    props: [ 'item', 'isEditing' ],
    computed: {
        component(){
            return Default
        },
    }
}
</script>

<style>

</style>
