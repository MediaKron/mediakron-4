<template>
       <div class="homepage-settings pt-4">
        <UtilityNav></UtilityNav> 
        <div id="appearance" class="layout-sidebar-left mt-5 container">  
            <div class="row">
                <div class="sidebar-left col-md-4" >
                    <OptionsNav inHomepage></OptionsNav> 
                </div>
                <main role="main" class="with-sidebar-left col-md-8" > 
                <header>
                    <h1 class="line-behind heading-nudge-up mb-4"> Homepage Settings</h1>
                </header>
                    <b-form>
                        <h2>Introduction</h2>
                        <b-form-group label="Description" label-for="description">
                            <b-form-textarea id="description" :rows="3"></b-form-textarea>
                        </b-form-group>
                        <b-form-group label="Image" label-for="image">
                            <b-form-file id="image" placeholder="Choose a file..."></b-form-file>
                        </b-form-group>
                        <b-form-group label="Alternative Text" label-for="alt-text">
                            <b-form-input id="alt-text" placeholder="Describe this image for web accessibility"></b-form-input>
                        </b-form-group>
                        <h2>Layout</h2>
                        <b-form-group label="Radios using sub-components">
                            <b-form-radio-group id="radios2" v-model="selected" name="radioSubComponent" stacked>
                                <b-form-radio value="menu-banner">
                                    <div>
                                        <img src="@/core-css/img/layout-icons/menu-banner.png" alt="" class="radio-image">
                                        <div class="radio-description">
                                            <p class="font-weight-bold mb-0">Menu Banner</p>
                                            <p>Menus display as thumbnails</p>
                                        </div> 
                                    </div>
                                </b-form-radio>
                            </b-form-radio-group>
                        </b-form-group>
                        <h2>Home Page Content</h2>
                        <b-button variant="primary">Choose Content</b-button>
                    </b-form>

                </main>
            </div>
        </div>
        <OptionsSavebar></OptionsSavebar>
    </div>
</template>

<script>
import UtilityNav from "./../navigation/UtilityNav";
import OptionsNav from "./../navigation/OptionsNav";
import OptionsSavebar from '@/components/forms/OptionsSavebar';
export default {
    components: {
        UtilityNav,
        OptionsNav,
        OptionsSavebar
    },
    data() {
        return {
            selected: 'menu-banner'
        }
    }
};
</script>

<style>
.radio-image {
    display: inline-block;
    float: left;
}

.radio-description {
    display: inline-block;
    float: right;
    padding: 0px 50px 0px 15px;

}

</style>
