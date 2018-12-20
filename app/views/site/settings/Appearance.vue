<template>


<div class="admin-pane admin-appearance overlay overlay-half">

<header class="overlay-header">
  <div class="header-inner">
    <h2><span class="mk-icon mk-settings"></span> Settings > Appearance</h2> 	
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

<div id="admin-appearance" class="site-settings">
	<div id="item-content">
		
		<form class="form-horizontal">
		
				<h3 class="title">Appearance</h3>	
								
				<fieldset class="appearance-colors">
				
				<legend>Banner Colors</legend>
  				<div class="field-group"> 
            <div class="form-instructions">You check to make sure there's enough contrast between the background color and link color using the <a href="http://webaim.org/resources/contrastchecker/">WebAIM Color Contrast Checker.</a>  </div>	
            
            <div class="field">
            	<label for="banner-color" class="custom-colors">Banner Background</label>
            	<input id="banner-color" type='color' name='banner-color' v-model="localData.banner_color" />
            </div>
            
            <div class="field">
            	<label for="banner-link-color" class="custom-colors">Banner Link Color</label>
            	<input id="banner-link-color" type='color' name='banner-link' v-model="localData.banner_link_color" />
            </div>
            
  			    </div>					
				</fieldset>
				
				<fieldset class="appearance-fonts">		
				<legend>Fonts</legend>
  				 <div class="form-instructions">The default font style for the site.</div>	
  					<div class="field-group">
						<div class="field">
							<select id="select-font" name="site-font">
								<option v-for="(key,font) in fonts" v-bind:key="key" :value="font">{{ key }}...</option>
							</select>
						</div>
					</div>
				</fieldset>
				
				<fieldset class="appearance-site-logo">	
				<legend>Logo</legend>
					<div class="field site-logo edit-image clearfix">
						<label for="image" class="sr-only">Site Logo</label>
						<div class="form-instructions">The site logo will appear next to the site title and will be resized to fit the available area.</div>
						
						<div class="edit-thumbnail">
							
						</div>
                        
				        <button id="remove-image" type="submit" class="btn submit btn-no-style <%= removeClass %>"><span class="mk-icon mk-remove"> </span> <span class="sr-only">Remove Logo Image</span></button>
				         <button id="upload-image" type="submit" class="btn submit btn-primary"><span class="mk-icon mk-upload"> </span> Upload Logo Image</button>
				        <input id="image-file" type="file" placeholder="Image"  model-attr="image" />    
								
						<div id="file-progress-bar" role="progressbar">
							<div id="file-progress-text">Loading</div>
							<div class="progress progress-striped active">
								<div class="progress-bar" style="width: 0%"></div>
							</div>
						</div>  
					</div>
					</fieldset>


		</form>
	</div><!-- End #item -->				    
				
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
    data(){
        return{
            fonts: {
                "Roboto (san serif)": "\"Roboto\", Helvetica, Arial, sans-serif", 
                "Helvetica Neue (sans serif)": "\"Helvetica Neue\", Helvetica, Arial, sans-serif",	        
                "Georgia (serif)":  "Georgia, serif",	         
                "Merriweather (serif)":  "\"Merriweather\", Georgia, serif"
            }
        }
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
