<template>
  <div :class="['js-drop-section', 'c-drop-section', { 'c-drop-section__over': isOver }]">
    <vue-transmit @dragover="dragOverHandler"
                  v-bind="options"
                  @success="success"
                  @processing="processing"
                  @error="error"
                  ref="uploader" >
      <div v-if="hasImage">
        <div class="c-drop-section__preview">
          <img :src="image.uri" />
        </div>
        <div v-if="hasError">
          <p class="c-drop-section__error">{{ errorMsg }}</p>
        </div>
        <div class="c-drop-section__cta" v-if="!loading">
          <a class="u-text--smaller" @click.prevent="remove" href="#">Remove Image</a>
        </div>
      </div>
      <div v-else>
        <div class="c-drop-section__box">
          <span v-if="isLoading || loading" class="c-loader">Loading...</span>
          <div v-else>
            <svgicon name="profile" class="c-icon--margin-right"></svgicon>
            <p>Drag and drop photo here <br />or click the link below.<br/>Minimum size 800x800 px.</p>
          </div>
        </div>
        <div v-if="hasError">
          <p class="c-drop-section__error">{{ errorMsg }}</p>
        </div>
        <div class="c-drop-section__cta">
          <a class="u-text--smaller" @click.prevent="triggerBrowse" href="#">Upload Image</a>
        </div>
      </div>
    </vue-transmit>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import config from '@/config';
import { mapActions } from 'vuex';

export default Vue.extend({
  props: {
    image: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      errorMsg: false,
      isOver: false,
      isLoading: false,
      options: {
        acceptedFileTypes: ['image/*'],
        url: config.API_HOSTNAME + '/upload',
        maxFiles: 1,
        maxFileSize: 20,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('user-token'),
        },
        clickable: false,
      },
    };
  },
  computed: {
    hasImage() {
      return this.image && this.image.uri && this.image.uri !== '';
    },
    hasError(): boolean {
      return false !== this.errorMsg;
    },
  },
  methods: {
    processing() {
      this.isLoading = true;
      this.errorMsg = false;
    },
    triggerBrowse() {
      this.$refs.uploader.triggerBrowseFiles();
    },
    uploadedHandler(file, response) {
      this.$emit('success', file);
    },
    dragOverHandler(event) {
      this.isOver = !this.isOver;
    },
    remove() {
      this.$refs.uploader.removeAllFiles(true);
      this.$emit('remove');
    },
    success(file, response, formData) {
      this.isLoading = false;
      this.$emit('success', response);
    },
    error(file, message: string, xhr) {
      let msg = message;

      if (file.size > this.options.maxFileSize * 1024 * 1024) {
        msg = `File exceeds the max size of ${this.options.maxFileSize}MB.`;
      }

      this.isLoading = false;
      this.errorMsg = msg;
    },
  },
  mounted() {
    if (this.image && this.image.size && this.image.name && this.image.uri && this.image.uri !== ''){
      // TODO: This should be removed, or filled in.
    }
  },
  filters: {
    json(value) {
      return JSON.stringify(value, null, 2);
    }
  }
});
</script>
