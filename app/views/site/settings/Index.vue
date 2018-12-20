<template>
  <div>
    <!-- # Admin Pane - Settings # -->
    <div class="admin-pane admin-settings overlay overlay-sidebar-narrow">
      <header class="overlay-header">
        <div class="header-inner">
          <h2>
            <span class="mk-icon mk-settings"></span> Settings
          </h2>
          <nav>
            <ul class="page-options">
              <li class="option-close">
                <button class="btn btn-sm btn-default close-button" aria-label="Close">
                  <span class="mk-icon mk-close"></span>
                  <span class="button-text">Close</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div id="settings" class="site-settings">
        <div v-if="access('can change site settings')">
          <h3>
            <span class="mk-icon mk-equalizer"></span>General Site Settings
          </h3>

          <ul class="settings-section">
            <li class="settings-item">
              <router-link :to="basePath + '/settings/general'" class="settings-link">Site Title and Information</router-link>
            </li>
            <li class="settings-item">
              <router-link :to="basePath + '/settings/privacy'" class="settings-link">Privacy Settings</router-link>
            </li>
            <li class="settings-item">
              <router-link :to="basePath + '/settings/comments'" class="settings-link">Comments</router-link>
            </li>
          </ul>

          <h3>
            <span class="mk-icon mk-appearance"></span>Appearance
          </h3>
          <ul class="settings-section">
            <li class="settings-item">
              <router-link :to="basePath + '/settings/appearance'" class="settings-link">Color Scheme and Font</router-link>
            </li>
            <li class="settings-item">
              <router-link :to="basePath + '/settings/navigation'" class="settings-link">Menus</router-link>
            </li>
            <li class="settings-item">
              <router-link :to="basePath + '/settings/homepage'" class="settings-link">Homepage Options</router-link>
            </li>
            <li class="settings-item">
              <router-link :to="basePath + '/settings/itemoptions'" class="settings-link">Item Options</router-link>
            </li>
          </ul>

          <h3>
            <span class="mk-icon mk-users"></span>Users
          </h3>
          <ul class="settings-section">
            <li class="settings-item">
              <router-link :to="basePath + '/settings/users'" class="settings-link">Manage Users</router-link>
            </li>
            <li class="settings-item">
              <router-link :to="basePath + '/settings/statistics'" class="settings-link">Usage Statistics</router-link>
            </li>
            <li class="settings-item">
              <router-link :to="basePath + '/settings/googleanalytics'" class="settings-link">Google Analytics</router-link>
            </li>
          </ul>
        </div>
        <div v-if="access('can archive content') || access('can import') ">
          <h3>
            <span class="mk-icon mk-grid"></span>Content
          </h3>
          <ul class="settings-section">
            <li class="settings-item">
              <router-link :to="basePath + '/browse'" class="settings-link">All Content</router-link>
            </li>
            <li class="settings-item">
              <router-link :to="basePath + '/settings/import'" class="settings-link">Import</router-link>
            </li>
            <li class="settings-item">
               <router-link :to="basePath + '/comingsoon'">Export (coming soon)</router-link>
            </li>

            <li v-if="access('can restore from trash')" class="settings-item">
              <router-link :to="basePath + '/settings/trash'" class="settings-link">Deleted Content</router-link>
            </li>

            <li v-if="access('can archive content')" class="settings-item">
              <router-link :to="basePath + '/browse/archived'" class="settings-link">Archived Content</router-link>
            </li>
          </ul>
          <div v-if="access('can change site settings')">
            <h3>
              <span class="mk-icon mk-wrench"></span>Tools
            </h3>
            <ul class="settings-section" v-if="access('can change site settings')">
              <li class="settings-item">
                <router-link :to="basePath + '/settings/canvas'" class="settings-link">Canvas</router-link>
              </li>
              <li class="settings-item">
                <router-link :to="basePath + '/settings/performance'" class="settings-link">Site Cache</router-link>
              </li>
              <li class="settings-item">
                <router-link :to="basePath + '/settings/search'" class="settings-link">Search</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
        mapGetters, mapActions
    } from 'vuex';
export default {
    computed:{
        ...mapGetters('users/profile', [
            'access'
        ]),
        ...mapGetters('sites', [
            'currentSite',
            'basePath'
        ])
    }
};
</script>

<style>
</style>
