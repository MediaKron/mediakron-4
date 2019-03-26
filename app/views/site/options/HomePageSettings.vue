<template>
    <div class="homepage-settings">
        <main role="main" class="px-6 min-h-screen w-full lg:static lg:max-h-full lg:overflow-visible max-w-lg">
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
                <b-form-group label="">
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
                        <b-form-radio value="menu-half">
                            <div>
                                <img src="@/core-css/img/layout-icons/menu-half.png" alt="" class="radio-image">
                                <div class="radio-description">
                                    <p class="font-weight-bold mb-0">Half-page intro banner with thumbnail
                                        menus</p>
                                    <p>Background image or solid theme color (if no image); Menu items included
                                        as thumbnails below</p>
                                </div>
                            </div>
                        </b-form-radio>
                        <b-form-radio value="homepage-centered">
                            <div>
                                <img src="@/core-css/img/layout-icons/homepage-centered.png" alt="" class="radio-image">
                                <div class="radio-description">
                                    <p class="font-weight-bold mb-0">Centered</p>
                                    <p>Centered layout with subtitle at the top, followed by an image, if
                                        present, and then a description.</p>
                                </div>
                            </div>
                        </b-form-radio>
                        <b-form-radio value="homepage-full">
                            <div>
                                <img src="@/core-css/img/layout-icons/homepage-full.png" alt="" class="radio-image">
                                <div class="radio-description">
                                    <p class="font-weight-bold mb-0">Full-page Banner with background
                                        image/theme color </p>
                                    <p>Centered title and subtitle over background image. Site description
                                        displays below, if present.</p>
                                </div>
                            </div>
                        </b-form-radio>
                        <b-form-radio value="homepage-half">
                            <div>
                                <img src="@/core-css/img/layout-icons/homepage-half.png" alt="" class="radio-image">
                                <div class="radio-description">
                                    <p class="font-weight-bold mb-0">Half-page Banner with background
                                        image/theme color </p>
                                    <p>Centered title and subtitle over background image. Site description
                                        displays below, if present.</p>
                                </div>
                            </div>
                        </b-form-radio>
                        <b-form-radio value="homepage-right">
                            <div>
                                <img src="@/core-css/img/layout-icons/homepage-right.png" alt="" class="radio-image">
                                <div class="radio-description">
                                    <p class="font-weight-bold mb-0">Right</p>
                                    <p>Image on right, subtitle/description on left.</p>
                                </div>
                            </div>
                        </b-form-radio>
                        <b-form-radio value="homepage-left">
                            <div>
                                <img src="@/core-css/img/layout-icons/homepage-left.png" alt="" class="radio-image">
                                <div class="radio-description">
                                    <p class="font-weight-bold mb-0">Left</p>
                                    <p>Image on left, subtitle/description on right.</p>
                                </div>
                            </div>
                        </b-form-radio>
                        <b-form-radio value="updates-basic">
                            <div>
                                <img src="@/core-css/img/layout-icons/homepage-centered.png" alt="" class="radio-image">
                                <div class="radio-description">
                                    <p class="font-weight-bold mb-0">Updates Basic</p>
                                    <p>List of new and updated content</p>
                                </div>
                            </div>
                        </b-form-radio>
                        <b-form-radio value="updates-half">
                            <div>
                                <img src="@/core-css/img/layout-icons/homepage-half.png" alt="" class="radio-image">
                                <div class="radio-description">
                                    <p class="font-weight-bold mb-0">Half-page Banner with Updates </p>
                                    <p>Background image or solid theme color (if no image); List of new and
                                        updated content below</p>
                                </div>
                            </div>
                        </b-form-radio>
                        <b-form-radio value="updates-full">
                            <div>
                                <img src="@/core-css/img/layout-icons/homepage-full.png" alt="" class="radio-image">
                                <div class="radio-description">
                                    <p class="font-weight-bold mb-0">Full-page Banner with Updates</p>
                                    <p>Background image or solid theme color (if no image); List of new and
                                        updated content below</p>
                                </div>
                            </div>
                        </b-form-radio>
                        <b-form-radio value="no-intro">
                            <div>
                                <img src="@/core-css/img/layout-icons/homepage-none.png" alt="" class="radio-image">
                                <div class="radio-description">
                                    <p class="font-weight-bold mb-0">No introduction</p>
                                    <p>Choose this if you plan to use only a content item as the home page (see
                                        below).</p>
                                </div>
                            </div>
                        </b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
                <h2>Home Page Content</h2>
                <b-button variant="primary">Choose Content</b-button>

                        <OptionsSavebar></OptionsSavebar>
            </b-form>

        </main>
    </div>
</template>

<script>
    import OptionsSavebar from '@/components/forms/OptionsSavebar';
    export default {
        components: {
            OptionsSavebar,
        },
        data() {
            return {
                selected: 'menu-banner'
            }
        }
    };
</script>

<style>
    .layout {
        width: 1000px;

    }

    b-form-radio {
        margin-top: 1.4em;
    }

    .radio-image {
        display: inline-block;
        float: left;
    }

    .radio-description {
        display: inline-block;
        float: right;
        padding: 0px 50px 0px 15px;
        width: 600px;

    }
</style>