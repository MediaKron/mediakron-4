<template>
    <div class="settings-general">

                <header>
                     <h2><span class="mk-icon mk-settings"></span> Site Settings</h2>
                </header>
                <label for="site-information-field">Site Information</label>
                <b-form-input 
                    id="site-information-field"
                    v-model="localData.title" 
                    @input="dataChange"
                    type="text"
                    placeholder="Site Information">
                </b-form-input>

                <label for="site-subtitle-field">Site Subtitle</label>
                <b-form-input 
                    id="site-subtitle-field"
                    v-model="localData.subtitle" 
                    @input="dataChange"
                    type="text"
                    placeholder="Site Subtitle">
                </b-form-input>

                <label for="insitution">Insitution</label>
                <b-form-input 
                    id="insitution"
                    v-model="localData.institution" 
                    @input="dataChange"
                    type="text"
                    placeholder="Insitution">
                </b-form-input>

                <label for="copyright">Copyright</label>
                <b-form-input 
                    id="copyright"
                    type="text"
                    placeholder="copyright">
                </b-form-input>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet egestas nunc. Sed commodo libero vel lacus consectetur feugiat. Phasellus ac vestibulum turpis, ac sollicitudin erat. Etiam venenatis auctor mi, sit amet iaculis libero feugiat tristique. Mauris sed sem quis ligula elementum pretium quis ut turpis. Donec in finibus lacus. Aliquam placerat sit amet dolor vel auctor. Nam pulvinar in odio sed venenatis. Suspendisse pharetra sapien mauris, id placerat enim condimentum vel.

Aliquam a nisi in lorem posuere eleifend ut eget risus. Quisque molestie diam sed porttitor maximus. In a auctor est, id facilisis nibh. Aliquam at diam aliquam eros euismod sollicitudin. Praesent sit amet dui luctus ante efficitur volutpat sit amet non neque. Fusce ac ex vitae ipsum vulputate suscipit. Nam non consectetur nibh, quis lobortis magna. Integer accumsan erat eu purus dictum, eget rutrum lectus mollis.

Sed lorem risus, molestie nec aliquam feugiat, mattis quis arcu. Nunc nisi enim, vehicula ut rhoncus et, malesuada sed massa. Aliquam pulvinar felis nec molestie vestibulum. Vivamus sed velit eget lacus lobortis eleifend. Phasellus nisi nulla, hendrerit vel tristique at, tincidunt nec sem. Cras quis lacus nec eros tincidunt tempor. Aenean sem nulla, faucibus vel luctus eu, placerat vitae justo. Ut et nulla at libero pretium imperdiet. Cras nulla massa, dictum non massa vitae, commodo varius nisi. Sed a risus ac urna convallis ultricies. Sed metus purus, posuere nec efficitur dignissim, lobortis eu massa. Pellentesque dignissim purus vel est cursus, sit amet imperdiet magna elementum. Donec volutpat enim id urna dapibus, id consequat libero volutpat.

Sed ut pellentesque tellus. In dictum tristique risus, vel lacinia elit ultricies ut. Proin eros nisl, facilisis at risus nec, sagittis venenatis nisl. Nam odio lectus, fringilla ultrices nibh et, vestibulum viverra orci. Quisque luctus nunc ac consectetur accumsan. Maecenas ante metus, laoreet malesuada augue volutpat, efficitur commodo augue. Duis pharetra leo sit amet diam tincidunt, nec commodo magna molestie.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet egestas nunc. Sed commodo libero vel lacus consectetur feugiat. Phasellus ac vestibulum turpis, ac sollicitudin erat. Etiam venenatis auctor mi, sit amet iaculis libero feugiat tristique. Mauris sed sem quis ligula elementum pretium quis ut turpis. Donec in finibus lacus. Aliquam placerat sit amet dolor vel auctor. Nam pulvinar in odio sed venenatis. Suspendisse pharetra sapien mauris, id placerat enim condimentum vel.

Aliquam a nisi in lorem posuere eleifend ut eget risus. Quisque molestie diam sed porttitor maximus. In a auctor est, id facilisis nibh. Aliquam at diam aliquam eros euismod sollicitudin. Praesent sit amet dui luctus ante efficitur volutpat sit amet non neque. Fusce ac ex vitae ipsum vulputate suscipit. Nam non consectetur nibh, quis lobortis magna. Integer accumsan erat eu purus dictum, eget rutrum lectus mollis.

Sed lorem risus, molestie nec aliquam feugiat, mattis quis arcu. Nunc nisi enim, vehicula ut rhoncus et, malesuada sed massa. Aliquam pulvinar felis nec molestie vestibulum. Vivamus sed velit eget lacus lobortis eleifend. Phasellus nisi nulla, hendrerit vel tristique at, tincidunt nec sem. Cras quis lacus nec eros tincidunt tempor. Aenean sem nulla, faucibus vel luctus eu, placerat vitae justo. Ut et nulla at libero pretium imperdiet. Cras nulla massa, dictum non massa vitae, commodo varius nisi. Sed a risus ac urna convallis ultricies. Sed metus purus, posuere nec efficitur dignissim, lobortis eu massa. Pellentesque dignissim purus vel est cursus, sit amet imperdiet magna elementum. Donec volutpat enim id urna dapibus, id consequat libero volutpat.

Sed ut pellentesque tellus. In dictum tristique risus, vel lacinia elit ultricies ut. Proin eros nisl, facilisis at risus nec, sagittis venenatis nisl. Nam odio lectus, fringilla ultrices nibh et, vestibulum viverra orci. Quisque luctus nunc ac consectetur accumsan. Maecenas ante metus, laoreet malesuada augue volutpat, efficitur commodo augue. Duis pharetra leo sit amet diam tincidunt, nec commodo magna molestie.


</div>
</template>

<script>
import Vue from 'vue';
import _ from 'underscore';
import data from '@/components/mixins/data';
import Settingsnav from "./SettingsNav.vue";
import { mapState, mapActions } from 'vuex';
export default  Vue.extend({
    mixins: [ data ],
    components: {
     Settingsnav,
    },
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
        
    }
});
</script>

<style>

</style>
