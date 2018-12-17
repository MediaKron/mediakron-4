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
              <a href="/settings/general" class="settings-link">Site Title and Information</a>
            </li>
            <li class="settings-item">
              <a href="/settings/privacy" class="settings-link">Privacy Settings</a>
            </li>
            <li class="settings-item">
              <a href="/settings/comments" class="settings-link">Comments</a>
            </li>
          </ul>

          <h3>
            <span class="mk-icon mk-appearance"></span>Appearance
          </h3>
          <ul class="settings-section">
            <li class="settings-item">
              <a href="/settings/appearance" class="settings-link">Color Scheme and Font</a>
            </li>
            <li class="settings-item">
              <a href="/settings/navigation" class="settings-link">Menus</a>
            </li>
            <li class="settings-item">
              <a href="/settings/homepage" class="settings-link">Homepage Options</a>
            </li>
            <li class="settings-item">
              <a href="/settings/itemoptions" class="settings-link">Item Options</a>
            </li>
          </ul>

          <h3>
            <span class="mk-icon mk-users"></span>Users
          </h3>
          <ul class="settings-section">
            <li class="settings-item">
              <a href="/settings/users" class="settings-link">Manage Users</a>
            </li>
            <li class="settings-item">
              <a href="/settings/statistics" class="settings-link">Usage Statistics</a>
            </li>
            <li class="settings-item">
              <a href="/settings/googleanalytics" class="settings-link">Google Analytics</a>
            </li>
          </ul>
        </div>
        <div v-if="access('can archive content') || access('can import') ">
          <h3>
            <span class="mk-icon mk-grid"></span>Content
          </h3>
          <ul class="settings-section">
            <li class="settings-item">
              <a href="/browse" class="settings-link">All Content</a>
            </li>
            <li class="settings-item">
              <a href="/settings/import" class="settings-link">Import</a>
            </li>
            <li class="settings-item">
              <a class="comingsoon">Export (coming soon)</a>
            </li>

            <li v-if="access('can restore from trash')" class="settings-item">
              <a href="/settings/trash" class="settings-link">Deleted Content</a>
            </li>

            <li v-if="access('can archive content')" class="settings-item">
              <a href="/browse/archived" class="settings-link">Archived Content</a>
            </li>
          </ul>
          <div v-if="access('can change site settings')">
            <h3>
              <span class="mk-icon mk-wrench"></span>Tools
            </h3>
            <ul class="settings-section" v-if="access('can change site settings')">
              <li class="settings-item">
                <a href="/settings/canvas" class="settings-link">Canvas</a>
              </li>
              <li class="settings-item">
                <a href="/settings/performance" class="settings-link">Site Cache</a>
              </li>
              <li class="settings-item">
                <a href="/settings/search" class="settings-link">Search</a>
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
        ])
    }
};
</script>

<style>
</style>
