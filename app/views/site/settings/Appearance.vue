<template>
    <div class="appearance-layout w-full mx-auto max-w-5xl">
        <main role="main" class="max-w-2xl">
            <b-form>
                <header>
                    <h1 class="line-behind heading-nudge-up mb-4"><span class="mk-icon mk-settings"></span>Site
                        Appearance Options</h1>
                </header>

                <h2> Banner Colors</h2>

                <div class="form-instructions mb-4">You check to make sure there's enough contrast between the
                    background color and link color using the <a
                        href="http://webaim.org/resources/contrastchecker/">WebAIM Color Contrast Checker.</a>
                </div>

                <b-form-group label="Banner background" label-for="banner-color" horizontal>
                    <b-form-input id="banner-color" type='color' name='banner-color' v-model="localData.banner_color">
                    </b-form-input>
                </b-form-group>

                <b-form-group label="Banner Link Color" label-for="banner-link-color" horizontal>
                    <b-form-input id="banner-link-color" type='color' name='banner-link'
                        v-model="localData.banner_link_color"></b-form-input>
                </b-form-group>

                <h2 class="mt-5">Fonts</h2>

                <div class="form-instructions mb-4">The default font style for the site.</div>
                <b-form-group label="Site Font" label-for="font" label-sr-only>
                    <b-form-select id="font" v-model="selected" :options="fonts" class="mb-3" />
                </b-form-group>

                <h2 class="mt-5">Logo</h2>
                <b-form-group>
                    <div class="form-instructions mb-4">The site logo will appear next to the site title and will be
                        resized to fit the available area.</div>

                    <b-alert show variant="warning">[Add ImageUpload component]</b-alert>

                    <!-- <ImageUpload></ImageUpload> -->

                    <b-progress class="bt-2" :value="counter" :max="max" show-progress animated></b-progress>
                </b-form-group>
                <OptionsSavebar></OptionsSavebar>
            </b-form>
        </main>
    </div>
</template>

<script>
    import Vue from 'vue';
    import _ from 'underscore';
    import data from '@/components/mixins/data';
    import {
        mapState,
        mapActions
    } from 'vuex';
    import OptionsSavebar from '@/components/buttons/OptionsSavebar';
    // import ImageUpload from '@/components/controls/ImageUpload';
    export default Vue.extend({
        components: {
            OptionsSavebar,
            // ImageUpload
        },
        mixins: [data],
        data() {
            return {
                fonts: [{
                        value: 'Roboto (san serif)',
                        text: 'Roboto (san serif)'
                    },
                    {
                        value: 'Helvetica Neue (sans serif)',
                        text: 'Helvetica Neue (sans serif)'
                    },
                    {
                        value: 'Georgia (serif)',
                        text: 'Georgia, serif'
                    },
                    {
                        value: 'Merriweather (serif',
                        text: 'Merriweather (serif)'
                    }
                ],
                counter: 45,
                max: 100
            }
        },
        computed: {
            ...mapState('sites', {
                sourceData: 'currentSite'
            })
        },
        methods: {
            ...mapActions('sites', [
                'update',
                'saveSite'
            ]),

            dataChange: _.debounce(function () {
                this.update(this.localData);
            }, 500),

            save() {
                this.saveSite(this.localData);
            },

            cancel() {}
        },
        mounted() {

        }
    });
</script>

<style>
    #banner-color,
    #banner-link-color {
        width: 3rem;
    }
</style>