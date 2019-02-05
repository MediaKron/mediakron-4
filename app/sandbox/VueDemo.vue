<template lang="html">
  <div class="container mt-5">
    <div>
    <TestButton size="sm" ></TestButton>
    </div>

    <div>
  <b-img src="../../node_modules/fortawesome/font-awesome/svgs/regular/bookmark.svg" fluid alt="Responsive image" />
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
