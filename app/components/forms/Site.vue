<template>
  <div class="o-row">
    <div class="o-col-8@lg">
      <div class="o-row">
        <div class="o-col-12">
          <div class="c-form-merge@md o-row u-mb-spacer-section-small@lg">
            <form-input :extra-classes="['o-col-6@md']" v-model="localData.first_name" v-validate="'required|max:255'" name="firstname" label="First Name" @input="handleDataUpdate" />
            <form-input :extra-classes="['o-col-6@md']" v-model="localData.last_name" v-validate="'required|max:255'" name="lastname" label="Last Name" @input="handleDataUpdate" />
          </div>
        </div>
        <div class="o-col-4">
          <form-input :extra-classes="['u-mb-spacer-section-small@lg']" v-model="localData.title" v-validate="'max:100'" name="title" label="Title" @input="handleDataUpdate" />
        </div>
        <div class="o-col-8">
          <div class="c-form-element u-mb-spacer-section-small@lg">
            <select v-model="selectedSpecialty">
              <option disabled value="">Specialty</option>
              <option v-for="(specialty, index) in specialtiesList" :value="specialty.value" :key="index">{{ specialty.name }}</option>
            </select>
          </div>
        </div>
        <div class="o-col-12" v-show="isOtherSpecialty">
          <form-input v-model="localData.specialty" v-validate="'max:255'" name="specialty" label="Specialty" @input="handleDataUpdate" />
        </div>
        <div class="o-col-12">
          <form-input :extra-classes="['u-mb-spacer-section-small@lg']" v-model="localData.email" v-validate="'email'" name="email" label="Email" @input="handleDataUpdate" />
        </div>
        <div class="o-col-12">
          <form-input type="textarea" :extra-classes="['u-mb-spacer-section-small@lg']" v-model="localData.bio" v-validate="'max:1500'" :maxLength="1500" name="bio" label="Practitioner Bio" @input="handleDataUpdate" />
        </div>
      </div>
    </div>
    <div class="o-col-4@lg u-order--first@lg">
      <image-upload-control
        :image="localData.image"
        @success="imageSuccessHandler"
        @remove="removeImageHandler"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import ImageUploadControl from '@/components/controls/image-upload.vue';
import { mapState, mapActions } from 'vuex';

export default Vue.extend({
  //mixins: [formDataMixin],
  inject: {
    //$validator: '$validator'
  },
  components: {
    //FormInput,
    ImageUploadControl,
  },
  data() {
    return {
      isOtherSpecialtySelected: false,
    };
  },
  computed: {
    ...mapState('practitioners', {
      sourceData: 'editablePractitioner',
      specialtiesList: 'specialtiesList',
    }),
    /**
     * Returns true if isOtherSpecialtySelected is true or current
     * localData.specialty is not found in specialtiesList except "Other"
     */
    isOtherSpecialty() {
      return this.isOtherSpecialtySelected || this.specialtiesList
        .map(specialty => specialty.value)
        .filter(specialty => 'Other' !== specialty)
        .indexOf(this.localData.specialty) === -1;
    },
    selectedSpecialty: {
      /**
       * Returns selected specialty
       */
      get() {
        return this.isOtherSpecialty ? 'Other' : this.localData.specialty;
      },
      /**
       * Sets new specialty, updates isOtherSpecialtySelected and fires
       * handleDataUpdate method
       */
      set(val: string) {
        // Set isOtherSpecialtySelected
        if ('Other' === val) {
          this.isOtherSpecialtySelected = true;
          return;
        } else if (this.isOtherSpecialtySelected) {
          this.isOtherSpecialtySelected = false;
        }

        this.localData.specialty = val;
        this.handleDataUpdate();
      },
    },
  },
  methods: {
    ...mapActions('practitioners', [
      PractitionersActions.UPDATE_EDITABLE_PRACTITIONER,
    ]),
    imageSuccessHandler(image: PractitionerImage) {
      this.localData.image = image;
      this.handleDataUpdate();
    },
    removeImageHandler() {
      this.localData.image = {};
      this.handleDataUpdate();
    },
    handleDataUpdate: _.debounce( function() {
      this[PractitionersActions.UPDATE_EDITABLE_PRACTITIONER](this.localData);
    }, 500),
  },
  mounted() {
    // Set isOtherSpecialtySelected to true if initial localData.specialty is
    // custom input
    if (this.isOtherSpecialty) {
      this.isOtherSpecialtySelected = true;
    }
  },
});
</script>
