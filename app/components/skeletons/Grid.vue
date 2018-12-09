<template>
  <div class="o-row">
    <div v-for="index in 3" :key="index" class="o-col-6@sm o-col-4@md">
      <div class="c-tile c-tile--item">
        <div class="c-card c-entry-card">
          <div class="c-card__item">
            <figure class="c-tile__element--expand u-move-up">
              <a href="">
                <span class="c-skeleton" style="width: 100%; height: 100%; position: absolute; top: 0; bottom: 0;"></span>
              </a>
            </figure>
            <header class="c-card__header">
              <div class="c-divider c-divider--extra-small">
                <span class="c-skeleton c-skeleton--text" style="width: 80%; margin-bottom: 20px;"></span>
              </div>
              <span class="c-skeleton c-skeleton--text-small" style="width: 50%;"></span>
            </header>
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
