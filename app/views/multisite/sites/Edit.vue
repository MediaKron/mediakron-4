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
            <image-upload-control :image="localData.image" @success="imageSuccessHandler" @remove="removeImageHandler" />
        </div>
    </div>
</template>

<script>
    export default {
        props: ['id']
    
    }
</script>

<style>
    
</style>
