<template>
    <div class="settings-general">

                <header>
                     <h1 class="heading-underlined"> General Site Settings</h1>
                </header>
                
                <h2><span class="mk-icon mk-settings"></span> Site Title and Information</h2>
              
                 <b-form-group
                    id="site-information"
                    description=""
                    label="Site Information"
                    label-for="site-information-field"
                    :invalid-feedback="invalidFeedback"
                    :valid-feedback="validFeedback"
                    :state="state">
               
                    <b-form-input 
                        id="site-information-field"
                        v-model="localData.title" 
                        @input="dataChange"
                        type="text"
                        placeholder="Enter a title">
                    </b-form-input>
                </b-form-group>

                <b-form-group
                    id="site-subtitle"
                    description=""
                    label="Site Subtitle"
                    label-for="site-subtitle-field"
                    :invalid-feedback="invalidFeedback"
                    :valid-feedback="validFeedback"
                    :state="state">
               
                    <b-form-input 
                        id="site-subtitle-field"
                        v-model="localData.subtitle" 
                        @input="dataChange"
                        type="text"
                        placeholder="Enter a Subtitle">
                    </b-form-input>
                </b-form-group>

                 <b-form-group
                    id="insitution"
                    description=""
                    label="Insitution"
                    label-for="institution-field"
                    :invalid-feedback="invalidFeedback"
                    :valid-feedback="validFeedback"
                    :state="state">
               
                    <b-form-input 
                        id="insitution-field"
                        v-model="localData.institution" 
                        @input="dataChange"
                        type="text"
                        placeholder="Enter Insitution">
                    </b-form-input>
                </b-form-group>

               <b-form-group
                    id="copyright"
                    description=""
                    label="Copyright"
                    label-for="copyright-field"
                    :invalid-feedback="invalidFeedback"
                    :valid-feedback="validFeedback"
                    :state="state">
               
                     <b-form-input 
                        id="copyright-field"
                        type="text"
                        placeholder="Enter copyright">
                     </b-form-input>
                </b-form-group>



        <h2 class="mt-4 pb-1"> Privacy</h2>

            <b-form-group label="Settings for whether your site is visible to the public or requires a password to access." description="">
                <b-form-radio-group id="privacy-settings"
                    size="lg"
                    v-model="selected"
                    :options="options"
                name="privacy-settings" />
                </b-form-group>
                <b-button-group class="savebar mt-5">
                    <b-button type="submit" variant="primary"><font-awesome-icon icon="check"/> Save</b-button>
                    <b-button type="reset" variant="outline-primary"><font-awesome-icon icon="times"/> Cancel</b-button>
                </b-button-group>
 
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
