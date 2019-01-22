<template>
<div class="canvas-settings">
        <b-nav pills class="mb-4 line-behind options-sectionnav">
            <b-nav-item :to="basePath + '/options/settings/general'">General</b-nav-item>
            <b-nav-item class="make-first" :to="basePath + '/options/settings/canvas'">Canvas</b-nav-item>
            <b-nav-item :to="basePath + '/options/settings/searchsettings'" >Search Settings</b-nav-item>
        </b-nav>
        <header>
                <h1 class="heading-nudge-up mb-4"> Canvas Settings</h1>
        </header>
    

         <OptionsSavebar></OptionsSavebar>
    </div>
</template>

<script>
import Vue from 'vue';
import _ from 'underscore';
import data from '@/components/mixins/data';
import OptionsSavebar from '@/components/forms/OptionsSavebar';
import { mapState, mapActions,mapGetters } from 'vuex';
export default  Vue.extend({
    mixins: [ data ],
    components: {
     OptionsSavebar
    },
    computed:{
        ...mapState('sites', {
            sourceData: 'currentSite'
        }),
         ...mapGetters('sites', [
            'basePath'
        ]),
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
