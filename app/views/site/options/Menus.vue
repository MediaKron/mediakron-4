<template>
    <div class="menus">
        <main role="main" class="px-6 min-h-screen w-full max-w-50 mx-auto lg:static lg:max-h-full lg:overflow-visible">
            <header>
                <h1 class="line-behind heading-nudge-up mb-4"> Menus</h1>
            </header>

            <h2 class="mb-4">Manage Menus</h2>

            <b-form-group label-sr-only label="Display Options" class="border border-grey-darker rounded p-3">
                <div class="flex mb-3">
                    <div class="flex-1 font-bold">Preview </div>
                    <b-form-radio class="pr-3" name="some-radios" value="A">Horizontal Navigation </b-form-radio>
                    <b-form-radio class="" name="some-radios" value="B">Vertical Dropdown Navigation</b-form-radio>
                </div>
                <div class="">
                    <b-navbar type="dark" class="shadowpl-3 pr-0 py-0 z-index-1" variant="primary">
                        <primarynav></primarynav>
                    </b-navbar>

                    <b-navbar tag="div" type="dark" class="shadow pl-3 pr-0 mt-2 py-0 z-index-1 hidden"
                        variant="primary">
                        <b-navbar-nav>
                            <b-nav-item-dropdown no-caret right extra-toggle-classes="text-uppercase"
                                extra-menu-classes="">
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
                </div>
            </b-form-group>
            <div class="flex justify-center ">
                <div class="mr-2 inline-block">
                    <b-btn v-b-modal.add-menus-form variant="dark" class="text-uppercase">
                        <font-awesome-icon icon="plus" /> Add Menu </b-btn>
                    <b-modal id="add-menus-form" size="lg" ok-title="Save" centered title="Add Menu">
                        <b-form @submit.prevent="updateUser">
                        </b-form>
                    </b-modal>
                </div>

                <div class="mr-2 inline-block">
                    <b-btn v-b-modal.add-link-form variant="dark" class="text-uppercase">
                        <font-awesome-icon icon="link" /> Add External Link </b-btn>
                    <b-modal id="add-link-form" ok-title="Save" centered title="Add External Link">
                        <b-form @submit.prevent="updateUser">
                            <b-form-input v-model="url" placeholder="Add a URL"></b-form-input>
                        </b-form>
                    </b-modal>
                </div>

                <div class="mr-2 inline-block">
                    <b-btn v-b-modal.manage-menus-form variant="dark" class="text-uppercase">
                        <font-awesome-icon icon="cog" /> Reorder/Remove Menus </b-btn>
                    <b-modal id="manage-menus-form" ok-title="Save" centered title="Reorder/Remove Menus">
                        <b-form @submit.prevent="updateUser">
                        </b-form>
                    </b-modal>
                </div>
            </div>

            <h2 class="mt-5">Visibility</h2>
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