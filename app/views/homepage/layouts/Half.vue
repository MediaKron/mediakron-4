<template>
    <div>
        <half-page :item="currentItem">{{ title }}</half-page>
        <ul>
            <li></li>
        </ul>
    </div>
</template>

<script>
import HalfPage from '@/views/components/HalfPage'
export default {
    components:{
        HalfPage
    }
}
</script>

<style>

</style>
