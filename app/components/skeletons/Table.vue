<template>
  <div>
    <span class="skeleton" style="width: 100%; margin-bottom: 0;"></span>
    <div style="border: 2px solid #ebebeb; padding: 20px; border-radius: 2px; margin-bottom: 20px;">
      <div v-for="index in 14" :key="index">
        <div class="o-row">
          <div class="o-col-6@md o-col-6@lg">
            <span class="c-skeleton c-skeleton--table" style="width: 100%;"></span>
          </div>
          <div class="o-col-4@md o-col-2@lg">
            <span class="c-skeleton c-skeleton--table" style="width: 100%;"></span>
          </div>
          <div class="o-col-1@md o-col-1@lg">
            <span class="c-skeleton c-skeleton--table" style="width: 100%;"></span>
          </div>
          <div class="o-col-1@md o-col-3@lg">
            <span class="c-skeleton c-skeleton--table" style="width: 100%;"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default Vue.extend({

});
</script>

<style lang="scss">

</style>
