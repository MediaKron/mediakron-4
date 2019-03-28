<template>
    <div class="menus">
        <main role="main" class="px-6 min-h-screen w-full max-w-50 mx-auto lg:static lg:max-h-full lg:overflow-visible">
            <header>
                <h1 class="line-behind heading-nudge-up mb-4"> Manage Menus</h1>
            </header>

            <h2>Primary Menus</h2>
            <p>Build a primary menu either by selecting existing content or creating links to external URLS </p>

            <b-form-group label-sr-only label="Display Options">
                <b-form-radio class="mb-2" name="some-radios" value="A">Horizontal Navigation </b-form-radio>
                <b-navbar type="dark" class="site-nav pl-3 pr-0 py-0 z-index-1" variant="primary">
                    <primarynav></primarynav>
                </b-navbar>

                <b-form-radio class="mt-3 mb-2" name="some-radios" value="B">Vertical Dropdown Navigation</b-form-radio>
                <b-navbar tag="div" type="dark" class="site-nav pl-3 pr-0 py-0 z-index-1" variant="primary">
                    <b-navbar-nav>
                        <b-nav-item-dropdown no-caret right extra-toggle-classes="text-uppercase" extra-menu-classes="">
                            <template slot="button-content" class="text-white">
                                <font-awesome-icon icon="bars" />
                                <span class="pl-2">Menus</span>
                            </template>
                            <b-dropdown-item :to="bsePath + '/content/mycontent'">test</b-dropdown-item>
                            <b-dropdown-item :to="basePath + '/content/all'"> test</b-dropdown-item>
                            <b-dropdown-item :to="basePath + '/content/deleted'">test</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-navbar>
            </b-form-group>

            <div class="Menus mt-3">
                <b-btn v-b-modal.add-menus-form variant="primary" class="text-uppercase">
                    <font-awesome-icon icon="plus" /> Add Menu </b-btn>
                <b-modal id="add-menus-form" size="lg" centered title="Add Menu">
                    <b-form @submit.prevent="updateUser">

                        <b-button type="submit" variant="primary" size="sm" class="text-uppercase">
                            <font-awesome-icon icon="check" /> Add</b-button>
                    </b-form>
                </b-modal>
            </div>

            <h2 class="mt-5">Secondary Menus</h2>
            <p>Show or hide secondary menus items that appear alongside the main menu.</p>
            <b-form-checkbox v-model="content" name="check-button" switch class="mb-2">
                Content (Visible to logged-in users except Members)
            </b-form-checkbox>
            <b-form-checkbox v-model="tags" name="check-button" switch class="mb-2">
                Tags
            </b-form-checkbox>
            <b-form-checkbox v-model="search" name="check-button" switch class="mb-2">
                Search
            </b-form-checkbox>
            <b-form-checkbox v-model="login" name="check-button" switch class="mb-2">
                Login
            </b-form-checkbox>
            <b-form-checkbox v-model="mklogo" name="check-button" switch class="mb-2">
                MediaKron Logo
            </b-form-checkbox>


            <OptionsSavebar></OptionsSavebar>
        </main>
    </div>
</template>

<script>
    import OptionsSavebar from '@/components/forms/OptionsSavebar';
    import Primarynav from "./../navigation/PrimaryNav";
    import {
        mapGetters
    } from 'vuex';
    export default {
        components: {
            OptionsSavebar,
            Primarynav,
        },
        computed: {
            ...mapGetters('sites', [
                'basePath'
            ]),
        },
        data() {
            return {
                content: true,
                tags: true,
                search: true,
                login: true,
                mklogo: true,

            }
        }
    };
</script>

<style>
</style>