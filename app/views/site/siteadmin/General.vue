<template>
    <div class="settings-general with-savebar">
        <b-nav pills class="options-sectionnav mb-4">
            <b-nav-item :to="basePath + '/options/settings/general'">General</b-nav-item>
            <b-nav-item :to="basePath + '/options/settings/canvas'">Canvas</b-nav-item>
            <b-nav-item :to="basePath + '/options/settings/searchsettings'" >Search Settings</b-nav-item>
        </b-nav>
        <header>
             <h1 class="line-behind mb-4"> General Site Settings</h1>
        </header>
    
        <h2 class="mt-5">Site Title and Subtitle</h2>
    
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


        <h2 class="mt-5">Other Site Information</h2>

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

        <h2 class="mt-5">Google Analytics</h2>

            <b-form-group
            id="google-analytics"
            description=""
            label="Google Analytics"
            label-for="google-analytics-field"
            label-sr-only
            :invalid-feedback="invalidFeedback"
            :valid-feedback="validFeedback"
            :state="state">
           
            <b-form-input 
            id="google-analytics-field"
            v-model="localData.googleanalytics" 
            @input="dataChange"
            type="text"
            placeholder="Enter the Google Analytics code id">
        </b-form-input>
        </b-form-group>

        <h2 class="mt-5 pb-1"> Privacy</h2>

        <b-form-group label="Settings for whether your site is visible to the public or requires a password to access.">
            <b-form-radio-group class="mt-2" id="privacy-settings" v-model="selected" name="privacy-settings" >
                <b-form-radio  value="selected">Site is Private</b-form-radio>
                <b-form-radio value="">Site is Public</b-form-radio>
            </b-form-radio-group>
        </b-form-group>

        <h2 class="mt-5 pb-1"> Item options</h2>
        <div class="form-instructions mb-4">Show or hide page elements site-wide.</div>
        
            <b-form-group>
                <b-form-radio-group class="mt-2" id="view-in-visibility" v-model="viewin" :options="options" name="view-in visibility" >
                        <b-form-radio checked value="is-visible">View In is Visible</b-form-radio>
                        <b-form-radio value="is-hidden">View-In is Hidden</b-form-radio>
                </b-form-radio-group>
            </b-form-group>     

            <b-form-group>
                <b-form-radio-group class="mt-2" id="author-date-visibility" v-model="authorinfo" name="author and date visibility" >
                        <b-form-radio value="is-visible">Author Info is Visible</b-form-radio>
                        <b-form-radio checked value="is-hidden">Author Info is Hidden</b-form-radio>
                </b-form-radio-group>
            </b-form-group>   

              <b-form-group>
                <b-form-radio-group  class="mt-2" id="download-visibility" v-model="download" :options="options" name="download button visibility" >
                        <b-form-radio value="is-visible">Download button is Visible</b-form-radio>
                        <b-form-radio checked value="is-hidden">Download button is Hidden</b-form-radio>
                </b-form-radio-group>
            </b-form-group>   

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
    data () {
        return {
        selected: 'selected',
        viewin: 'is-visible',
        authorinfo: 'is-hidden',
        download: 'is-hidden',
        }
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
