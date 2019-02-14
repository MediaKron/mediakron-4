<template>
    <component :is="component" :item="item" />
</template>

<script>
import Default from './Default'
import Full from './Full'
export default {
    props: [ 'item' ],
    computed: {
        component(){
            switch(this.item.template){
                case 'full':
                    return Full;
                default:
                    return Default;
            }
            
        }
    }
}
</script>

<style>

</style>
