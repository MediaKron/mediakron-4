<template>
    <div class="settings-general">
 <OptionsNav></OptionsNav> 
              
</div>
</template>

<script>
import Vue from 'vue';
import _ from 'underscore';
import data from '@/components/mixins/data';
import Settingsnav from "./SettingsNav.vue";
import OptionsNav from "./../navigation/OptionsNav";
import { mapState, mapActions } from 'vuex';
export default  Vue.extend({
    mixins: [ data ],
    components: {
     Settingsnav,
     OptionsNav
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
