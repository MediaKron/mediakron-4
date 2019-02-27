<template>
    <div>
        <component :is="component" :item="item" />
    </div>
</template>

<script>
import Default from './Default'

export default {
    props: [ 'item' ],
    computed: {
        component(){
            return Default
        }
    }
}
</script>

<style>

</style>
