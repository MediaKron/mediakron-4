<template lang="html">
  <div class="container mt-5">
    <div>
    <TestButton size="sm" ></TestButton>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import TestButton from '@/sandbox/TestButton';
export default  Vue.extend({
    components: {
     TestButton
    }
});
</script>

<style lang="css">
</style>
