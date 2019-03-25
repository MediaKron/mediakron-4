<template lang="html">
  <div class="container mt-5">
<div class="max-w-sm rounded overflow-hidden shadow-lg">
  <img class="w-full" src="https://tailwindcss.com/img/card-top.jpg" alt="Sunset in the mountains">
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
    <p class="text-grey-darker text-base">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
    </p>
  </div>
  <div class="px-6 py-4">
    <span class="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2">#photography</span>
    <span class="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2">#travel</span>
    <span class="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker">#winter</span>
  </div>
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
