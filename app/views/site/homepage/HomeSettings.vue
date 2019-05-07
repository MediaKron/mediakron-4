<template>
    <div class="homepage-settings">
        <navigation></navigation>
        <main role="main"
            class=" mt-10 px-6 min-h-screen w-full max-w-50 mx-auto lg:static lg:max-h-full lg:overflow-visible">
            <header>
                <h1 class="line-behind heading-nudge-up mb-4"> Homepage Settings</h1>
            </header>
            <b-form>
                <b-form-group id="site-information" class="mt-4">
                    <label for="site-information-field">Site Title</label>
                    <b-form-input id="site-information-field" v-model="localData.title" @input="dataChange" type="text"
                        placeholder="Site Title">
                    </b-form-input>

                </b-form-group>

                <b-form-group id="site-subtitle" class="mt-4">
                    <label for="site-subtitle-field">Site Subtitle</label>
                    <b-form-input id="site-subtitle-field" v-model="localData.subtitle" @input="dataChange" type="text"
                        placeholder="Enter a Subtitle">
                    </b-form-input>

                </b-form-group>

                <b-form-group label="Description" label-for="description">
                    <b-form-textarea id="description" :rows="3"></b-form-textarea>
                </b-form-group>
                <b-form-group label="Image" label-for="image">
                    <b-form-file id="image" placeholder="Choose a file..."></b-form-file>
                </b-form-group>
                <b-form-group label="Alternative Text" label-for="alt-text">
                    <b-form-input id="alt-text" placeholder="Describe this image for web accessibility"></b-form-input>
                </b-form-group>

                <b-button v-b-modal.homepage-layout variant="outline-dark" class="block my-4">
                    <font-awesome-icon icon="paint-brush" /> Change Layout</b-button>
                <b-modal id="homepage-layout" title="Change Layout" size="lg" centered>
                    <b-form-group label="">
                        <b-form-radio-group id="radios2" v-model="selected" name="radioSubComponent" stacked>
                            <b-form-radio value="menu-banner">
                                <div class="flex mb-3">
                                    <img src="@/core-css/img/layout-icons/menu-banner.png" alt="" class="radio-image">
                                    <div class="flex-1">
                                        <p class="font-weight-bold mb-0">Menu Banner</p>
                                        <p>Menus display as thumbnails</p>
                                    </div>
                                </div>
                            </b-form-radio>
                            <b-form-radio value="menu-half">
                                <div class="flex mb-3">
                                    <img src="@/core-css/img/layout-icons/menu-half.png" alt="" class="radio-image">
                                    <div class="flex-1">
                                        <p class="font-weight-bold mb-0">Half-page intro banner with thumbnail
                                            menus</p>
                                        <p>Background image or solid theme color (if no image); Menu items included
                                            as thumbnails below</p>
                                    </div>
                                </div>
                            </b-form-radio>
                            <b-form-radio value="homepage-centered">
                                <div class="flex mb-3">
                                    <img src="@/core-css/img/layout-icons/homepage-centered.png" alt=""
                                        class="radio-image">
                                    <div class="flex-1">
                                        <p class="font-weight-bold mb-0">Centered</p>
                                        <p>Centered layout with subtitle at the top, followed by an image, if
                                            present, and then a description.</p>
                                    </div>
                                </div>
                            </b-form-radio>
                            <b-form-radio value="homepage-full">
                                <div class="flex mb-3">
                                    <img src="@/core-css/img/layout-icons/homepage-full.png" alt="" class="radio-image">
                                    <div class="flex-1">
                                        <p class="font-weight-bold mb-0">Full-page Banner with background
                                            image/theme color </p>
                                        <p>Centered title and subtitle over background image. Site description
                                            displays below, if present.</p>
                                    </div>
                                </div>
                            </b-form-radio>
                            <b-form-radio value="homepage-half">
                                <div class="flex mb-3">
                                    <img src="@/core-css/img/layout-icons/homepage-half.png" alt="" class="radio-image">
                                    <div class="flex-1">
                                        <p class="font-weight-bold mb-0">Half-page Banner with background
                                            image/theme color </p>
                                        <p>Centered title and subtitle over background image. Site description
                                            displays below, if present.</p>
                                    </div>
                                </div>
                            </b-form-radio>
                            <b-form-radio value="homepage-right">
                                <div class="flex mb-3">
                                    <img src="@/core-css/img/layout-icons/homepage-right.png" alt=""
                                        class="radio-image">
                                    <div class="flex-1">
                                        <p class="font-weight-bold mb-0">Right</p>
                                        <p>Image on right, subtitle/description on left.</p>
                                    </div>
                                </div>
                            </b-form-radio>
                            <b-form-radio value="homepage-left">
                                <div class="flex mb-3">
                                    <img src="@/core-css/img/layout-icons/homepage-left.png" alt="" class="radio-image">
                                    <div class="flex-1">
                                        <p class="font-weight-bold mb-0">Left</p>
                                        <p>Image on left, subtitle/description on right.</p>
                                    </div>
                                </div>
                            </b-form-radio>
                            <b-form-radio value="updates-basic">
                                <div class="flex mb-3">
                                    <img src="@/core-css/img/layout-icons/homepage-centered.png" alt=""
                                        class="radio-image">
                                    <div class="flex-1">
                                        <p class="font-weight-bold mb-0">Updates Basic</p>
                                        <p>List of new and updated content</p>
                                    </div>
                                </div>
                            </b-form-radio>
                            <b-form-radio value="updates-half">
                                <div class="flex mb-3">
                                    <img src="@/core-css/img/layout-icons/homepage-half.png" alt="" class="radio-image">
                                    <div class="flex-1">
                                        <p class="font-weight-bold mb-0">Half-page Banner with Updates </p>
                                        <p>Background image or solid theme color (if no image); List of new and
                                            updated content below</p>
                                    </div>
                                </div>
                            </b-form-radio>
                            <b-form-radio value="updates-full">
                                <div class="flex mb-3">
                                    <img src="@/core-css/img/layout-icons/homepage-full.png" alt="" class="radio-image">
                                    <div class="flex-1">
                                        <p class="font-weight-bold mb-0">Full-page Banner with Updates</p>
                                        <p>Background image or solid theme color (if no image); List of new and
                                            updated content below</p>
                                    </div>
                                </div>
                            </b-form-radio>
                            <b-form-radio value="no-intro">
                                <div class="flex mb-3">
                                    <img src="@/core-css/img/layout-icons/homepage-none.png" alt="" class="radio-image">
                                    <div class="flex-1">
                                        <p class="font-weight-bold mb-0">No introduction</p>
                                        <p>Choose this if you plan to use only a content item as the home page (see
                                            below).</p>
                                    </div>
                                </div>
                            </b-form-radio>
                        </b-form-radio-group>
                    </b-form-group>
                </b-modal>


                <div>

                    <b-form-group description="Select a content item to appear on the homepage. It will appear below the site title and description.">
                        <b-dropdown id="add-items" class="mr-2" text="Add Items" variant="outline-dark">
                            <template slot="button-content">
                                <font-awesome-icon icon="th-large" /> Choose Homepage Content
                            </template>
                            <b-dropdown-item>Add New</b-dropdown-item>
                            <b-dropdown-item v-b-modal.addexisting-modal>Add Existing</b-dropdown-item>
                        </b-dropdown>

                        <b-modal size="lg" centered lazy id="addexisting-modal" title="Add Existing">
                            <AddExisting></AddExisting>
                        </b-modal>
                    </b-form-group>

                </div>

                <div class="right-0 top-0 fixed mr-4 mt-20 ">
                    <div class="flex flex-col">
                        <b-button type="submit" variant="dark" class="mb-2">
                            <font-awesome-icon icon="check" /> Save</b-button>
                        <b-button type="reset" variant="outline-dark" class="bg-light cancel-button">
                            <font-awesome-icon icon="times" /> Cancel</b-button>
                    </div>
                </div>
            </b-form>

        </main>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex';
    import _ from 'underscore';
    import data from '@/components/mixins/data';
    import Navigation from './../Navigation';
    export default Vue.extend({
        mixins: [data],
        components: {
            Navigation
        },
        data() {
            return {
                selected: 'selected',
            }
        },
        computed: {
            ...mapState('sites', {
                sourceData: 'currentSite'
            }),
            ...mapGetters('sites', [
                'basePath'
            ])
        },
        methods: {
            ...mapActions('sites', [
                'update'
            ]),

            dataChange: _.debounce(function () {
                this.update(this.localData);
            }, 500),
        },
    });
</script>

<style>

</style>