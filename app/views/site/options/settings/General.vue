<template>
    <div class="settings-general with-savebar">
        <b-nav class="options-sectionnav mb-4 line-behind">
            <b-nav-item :to="basePath + '/options/settings/general'">General</b-nav-item>
            <b-nav-item :to="basePath + '/options/settings/canvas'">Canvas</b-nav-item>
            <b-nav-item :to="basePath + '/options/settings/searchsettings'" >Search Settings</b-nav-item>
        </b-nav>
        <header>
             <h1 class="mb-5"> General Site Settings</h1>
        </header>
    
        <h2 class="mt-4">Site Title and Subtitle</h2>
    
        <b-form-group
        id="site-information"
        class="floating-label mt-4"
        :invalid-feedback="invalidFeedback"
        :valid-feedback="validFeedback"
        :state="state">
    
            <b-form-input 
                id="site-information-field"
                v-model="localData.title" 
                @input="dataChange"
                type="text"
                placeholder="Site Information">
            </b-form-input>
            <label for="site-information-field">Site Information</label>
        </b-form-group>

        <b-form-group
            id="site-subtitle"
            class="floating-label mt-4"
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
                <label for="site-subtitle-field">Site Subtitle</label>
        </b-form-group>


        <h2 class="mt-5">Other Site Information</h2>

        <b-form-group
        id="insitution"
        class="floating-label mt-4"
        :invalid-feedback="invalidFeedback"
        :valid-feedback="validFeedback"
        :state="state">
    
            <b-form-input 
                id="insitution-field"
                v-model="localData.institution" 
                @input="dataChange"
                type="text"
                placeholder="Insitution">
            </b-form-input>
            <label for="institution-field">Institution</label>
        </b-form-group>

        <b-form-group
            id="copyright"
            class="floating-label mt-4"
            :invalid-feedback="invalidFeedback"
            :valid-feedback="validFeedback"
            :state="state">
        
                <b-form-input 
                id="copyright-field"
                type="text"
                placeholder="Copyright">
                </b-form-input>
                <label for="copyright-field">Copyright</label>
        </b-form-group>

        <b-form-group
            id="google-analytics"
            class="floating-label mt-4"
            description="Enter your Google Analytics code"
            :invalid-feedback="invalidFeedback"
            :valid-feedback="validFeedback"
            :state="state">
           
            <b-form-input 
            id="google-analytics-field"
            v-model="localData.googleanalytics" 
            @input="dataChange"
            type="text"
            placeholder="Google Analytics">
            </b-form-input>
            <label for="google-analytics-field">Google Analytics</label>
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



        <OptionsSavebar 
        ></OptionsSavebar>
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
            'update'
        ]),

        dataChange: _.debounce( function() {
            this.update(this.localData);
        }, 500),

        cancel(){
        }
    },
    mounted(){
        
    }

});
</script>

<style>


</style>
