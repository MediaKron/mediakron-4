<template>
  <router-view/>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapState, mapGetters } from 'vuex';
//import { RootActions, EventTypes } from '@/store/types';
export default Vue.extend({
  methods: {
    ...mapActions([

    ])
  },
  watch: {
    '$route' (to, from) {
        // central dispatch for event routing
      /*return this[RootActions.DISPATCH_EVENT]({
        type: EventTypes.PAGE_CHANGE,
        eventObj: { to, from }
      });*/
    } 
  }
});
</script>
