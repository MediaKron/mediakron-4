<template>
    <div class="settings-general">

                <header>
                     <h2><span class="mk-icon mk-settings"></span> Site Title and Information</h2>
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
