<template>
    <div class="admin admin-general overlay overlay-half">

    <header class="overlay-header">
        <div class="header-inner">
            <h2><span class="mk-icon mk-settings"></span> Settings > Site Title and Information</h2>
            <nav>
                <ul class="page-options">
                    <li class="option-close">
                        <button class="btn btn-sm btn-default close-button" aria-label="Close">
          		<span class="mk-icon mk-close"></span>
          		<span class="button-text"> Close</span> 
          	</button>
                    </li>
                </ul>
            </nav>
        </div>
    </header>

    <div id="admin-site-settings" class="site-settings">
        <div id="item-content">

                <fieldset>
                    <legend id="edit-settings" class="section-title">Site Information</legend>
                    <div class="field">
                        <label for="site-name">Site Name</label>
                        <input name="name" class="settings-field" id="site-name" settings-attr="name" type="textfield" placeholder="Enter the name of your project"   v-model="currentSite.title" @input="dataChange"/>
                    </div>

                    <div class="field">
                        <label for="site-subtitle">Subtitle</label>
                        <input name="subtitle" class="settings-field" id="site-subtitle" settings-attr="subtitle" type="textfield" placeholder="An optional site subtitle "  v-model="currentSite.subtitle" @input="dataChange" />
                    </div>

                    <div class="field">
                        <label for="site-instituiton">Institution </label>
                        <input name="institution" class="settings-field" id="site-instituiton" settings-attr="institution" type="textfield" placeholder="Your institution" v-model="currentSite.institution" @input="dataChange" />
                    </div>
                </fieldset>

            
                <fieldset class="sr-only">
                    <legend>Copyright</legend>
                    <div class="field">
                        <label for="site-copyright" class="label-right sr-only">Copyright:</label>
                        <div name="copyright" aria-labelledby="site-copyright" role="textbox" aria-multiline="false" contenteditable="true" id="site-copyright" class="settings-field model-field" settings-attr="copyright" data-placeholder="Intellectual property/copyright type ">
                            
                        </div>
                    </div>
                </fieldset>
        </div>
    </div>
    <!-- End #item -->

    <div class="save-bar">
        <div class="save-bar-inner">
            <button id="done-editing" type="submit" class="btn btn-success submit btn-sm"><span class="mk-icon mk-save"> </span> Save</button>
            <button id="close-settings-context" class="btn btn-default btn-sm close-settings"><span class="mk-icon mk-close"> </span> Cancel</button>
        </div>
    </div>

</div>
</template>

<script>
import Vue from 'vue';
import _ from 'underscore';
import { mapState, mapGetters } from 'vuex';
export default  Vue.extend({
    computed:{
        ...mapState('sites', [
            'currentSite'
        ])
    },
    methods:{
        dataChange: _.debounce( function() {
            
        }, 500),
    },
    mounted(){
        
    }
});
</script>

<style>

</style>
