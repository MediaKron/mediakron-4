<template lang="html">
  <div class="container mt-5">
      <h1>MediaKron Docs</h1>
         <b-link class="block mt-4" to="docs/icons">Icons</b-link>

        <h2 class="mt-5">Loader</h2>
       
        <code>
        <loader v-if="listIsLoading"></loader></code>

         <loader></loader>
         <code>import Loader from '@/components/Loader';</code>

  </div>
</template>

<script>
import Loader from '@/components/Loader';
export default {
   components:{
        Loader
    },
}
</script>

<style lang="css">
</style>
