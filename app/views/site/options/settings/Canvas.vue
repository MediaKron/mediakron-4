<template>
<div class="canvas-settings">
        <header>
                <h1 class=" heading-nudge-up mb-4"> Canvas Settings</h1>
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
