<template>
<div class="admin admin-general overlay overlay-half">
    <header>
        <h2> Privacy</h2>
    </header>

    <div id="admin-site-settings" class="site-settings">
        <div id="item-content">
            <h3 class="title">Privacy</h3>
            <form autocomplete="off">
                <fieldset class="access-options radio-options" role="radio-group">
                    <legend class="sr-only">Privacy</legend>
                    <div class="form-instructions">Settings for whether your site is visible to the public or requires a password to access.</div>
                    <legend class="sr-only">Access Options</legend>
                    <div class="field">
                        <input 
                            type="radio" 
                            name="access" 
                            settings-attr="public" 
                            class="settings-radio settings-field" 
                            id="access-private" 
                            v-model="localData.public"  
                            @input="dataChange" 
                            :value="0" />
                        <label for="access-private"> Private (log-in required)</label>
                    </div>
                    <div class="field">
                        <input 
                            type="radio" 
                            name="access" 
                            settings-attr="public" 
                            class="settings-radio settings-field" 
                            id="access-public"  
                            v-model="localData.public"  
                            @input="dataChange" 
                            :value="1" />
                        <label for="access-public">Public (no log-in required to view site)</label>
                    </div>
                </fieldset>
            </form>
        </div>
        <!-- End #item -->

        <div class="save-bar">
            <div class="save-bar-inner">
                <button 
                    id="done-editing" 
                    type="submit" 
                    class="btn btn-success submit btn-sm"
                     @click.prevent="save"
                     >
                    <span class="mk-icon mk-save"> </span> Save</button>
                <button 
                    id="close-settings-context" 
                    class="btn btn-default btn-sm close-settings"
                     @click.prevent="cancel">
                    <span class="mk-icon mk-close"> </span> Cancel</button>
            </div>
        </div>

    </div>
    <!-- End sidebar-->
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
        
    }
});
</script>

<style>

</style>
