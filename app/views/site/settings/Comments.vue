<template>
    <div class="admin admin-comments overlay overlay-half">

    <header class="overlay-header">
        <div class="header-inner">
            <h2><span class="mk-icon mk-settings"></span> Settings > Comments</h2>
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
          <h3 class="title">Comments</h3>
          <form autocomplete="off">
          <div class="form-instructions">Settings for whether users can add comments to site content. </div>
            <div class="toggle-comments">
              <span class="toggle-label" aria-hidden="true">Comments are: </span>
              <div class='toggle'>
                <input name="comments" type="hidden" value="0" />
                <input id="comments-visibility" class="toggle-field" settings-attr="commenting" name="comments" type="checkbox" v-model="localData.comment" @input="dataChange" />
                  <div class='btn'>
                    <label for='comments-visibility'>
                     <div class='toggle-on btn btn-success btn-sm'> <i class='mk-icon mk-save'></i><span class="sr-only">Comments are </span> Visible</div>
                     <div class='toggle-handle btn btn-default'></div>
                     <div class='toggle-off btn btn-warning active'><i class='mk-icon mk-close'></i> 
                     </div>
                   </label>
                  </div>
                  <a href="#help/comments"><span class="mk-icon mk-help get-help"><span class="sr-only">Help: Comments</span></span></a>
              </div>
            </div>
        
        </form>
    </div>
    <!-- End #item -->

    <div class="save-bar">
        <div class="save-bar-inner">
            <button id="done-editing" type="submit" class="btn btn-success submit btn-sm" @click.prevent="save">
                <span class="mk-icon mk-save"> </span> Save</button>
            <button id="close-settings-context" class="btn btn-default btn-sm close-settings" @click.prevent="cancel">
                <span class="mk-icon mk-close"> </span> Cancel</button>
        </div>
    </div>

</div>
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
