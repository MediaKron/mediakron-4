<template>
    <div class="comment-settings">

    <header>
        <h2 class="mb-4"> Comment Settings</h2>
    </header>
    <b-form>
        <b-form-group label="Settings for whether users can add comments to site content:" description="">
        <b-form-radio-group id="comment-settings"
            size="lg"
            v-model="selected"
            :options="options"
        name="comment-settings" />
        </b-form-group>
        <b-button-group class="savebar mt-5">
            <b-button type="submit" variant="primary"><font-awesome-icon icon="check"/> Save</b-button>
            <b-button type="reset" variant="outline-primary"><font-awesome-icon icon="times"/> Cancel</b-button>
         </b-button-group>
    </b-form>
     <div>

   </div>
</div>

  

</template>

<script>
import Vue from 'vue';
import _ from 'underscore';
import data from '@/components/mixins/data';
import { mapState, mapGetters, mapActions } from 'vuex';
export default  Vue.extend({
    mixins: [ data ],
    computed:{
        ...mapState('sites', {
            sourceData: 'currentSite'
        })
    },
    methods:{
        ...mapActions('sites', [
            'update',
            'saveSite'
        ]),

        dataChange: _.debounce( function() {
            this.update(this.localData);
        }, 500),

        save(){
            this.saveSite(this.localData);
        },

        cancel(){
        }
    },
    mounted(){
        
    },
    data () {
    return {
      selected: 'off',
      options: [
        { text: 'Comments are on', value: 'on' },
        { text: 'Comments are off', value: 'off' }
      ]
    }
  }

});
</script>

<style>
.savebar.btn-group {
    position:fixed;
    bottom:2em;
}
</style>
