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
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet egestas nunc. Sed commodo libero vel lacus consectetur feugiat. Phasellus ac vestibulum turpis, ac sollicitudin erat. Etiam venenatis auctor mi, sit amet iaculis libero feugiat tristique. Mauris sed sem quis ligula elementum pretium quis ut turpis. Donec in finibus lacus. Aliquam placerat sit amet dolor vel auctor. Nam pulvinar in odio sed venenatis. Suspendisse pharetra sapien mauris, id placerat enim condimentum vel.

Aliquam a nisi in lorem posuere eleifend ut eget risus. Quisque molestie diam sed porttitor maximus. In a auctor est, id facilisis nibh. Aliquam at diam aliquam eros euismod sollicitudin. Praesent sit amet dui luctus ante efficitur volutpat sit amet non neque. Fusce ac ex vitae ipsum vulputate suscipit. Nam non consectetur nibh, quis lobortis magna. Integer accumsan erat eu purus dictum, eget rutrum lectus mollis.

Sed lorem risus, molestie nec aliquam feugiat, mattis quis arcu. Nunc nisi enim, vehicula ut rhoncus et, malesuada sed massa. Aliquam pulvinar felis nec molestie vestibulum. Vivamus sed velit eget lacus lobortis eleifend. Phasellus nisi nulla, hendrerit vel tristique at, tincidunt nec sem. Cras quis lacus nec eros tincidunt tempor. Aenean sem nulla, faucibus vel luctus eu, placerat vitae justo. Ut et nulla at libero pretium imperdiet. Cras nulla massa, dictum non massa vitae, commodo varius nisi. Sed a risus ac urna convallis ultricies. Sed metus purus, posuere nec efficitur dignissim, lobortis eu massa. Pellentesque dignissim purus vel est cursus, sit amet imperdiet magna elementum. Donec volutpat enim id urna dapibus, id consequat libero volutpat.

Sed ut pellentesque tellus. In dictum tristique risus, vel lacinia elit ultricies ut. Proin eros nisl, facilisis at risus nec, sagittis venenatis nisl. Nam odio lectus, fringilla ultrices nibh et, vestibulum viverra orci. Quisque luctus nunc ac consectetur accumsan. Maecenas ante metus, laoreet malesuada augue volutpat, efficitur commodo augue. Duis pharetra leo sit amet diam tincidunt, nec commodo magna molestie.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet egestas nunc. Sed commodo libero vel lacus consectetur feugiat. Phasellus ac vestibulum turpis, ac sollicitudin erat. Etiam venenatis auctor mi, sit amet iaculis libero feugiat tristique. Mauris sed sem quis ligula elementum pretium quis ut turpis. Donec in finibus lacus. Aliquam placerat sit amet dolor vel auctor. Nam pulvinar in odio sed venenatis. Suspendisse pharetra sapien mauris, id placerat enim condimentum vel.

Aliquam a nisi in lorem posuere eleifend ut eget risus. Quisque molestie diam sed porttitor maximus. In a auctor est, id facilisis nibh. Aliquam at diam aliquam eros euismod sollicitudin. Praesent sit amet dui luctus ante efficitur volutpat sit amet non neque. Fusce ac ex vitae ipsum vulputate suscipit. Nam non consectetur nibh, quis lobortis magna. Integer accumsan erat eu purus dictum, eget rutrum lectus mollis.

Sed lorem risus, molestie nec aliquam feugiat, mattis quis arcu. Nunc nisi enim, vehicula ut rhoncus et, malesuada sed massa. Aliquam pulvinar felis nec molestie vestibulum. Vivamus sed velit eget lacus lobortis eleifend. Phasellus nisi nulla, hendrerit vel tristique at, tincidunt nec sem. Cras quis lacus nec eros tincidunt tempor. Aenean sem nulla, faucibus vel luctus eu, placerat vitae justo. Ut et nulla at libero pretium imperdiet. Cras nulla massa, dictum non massa vitae, commodo varius nisi. Sed a risus ac urna convallis ultricies. Sed metus purus, posuere nec efficitur dignissim, lobortis eu massa. Pellentesque dignissim purus vel est cursus, sit amet imperdiet magna elementum. Donec volutpat enim id urna dapibus, id consequat libero volutpat.

Sed ut pellentesque tellus. In dictum tristique risus, vel lacinia elit ultricies ut. Proin eros nisl, facilisis at risus nec, sagittis venenatis nisl. Nam odio lectus, fringilla ultrices nibh et, vestibulum viverra orci. Quisque luctus nunc ac consectetur accumsan. Maecenas ante metus, laoreet malesuada augue volutpat, efficitur commodo augue. Duis pharetra leo sit amet diam tincidunt, nec commodo magna molestie.


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
