<template>
  <div>
    <b-form @submit.prevent="updateUser">
      <b-form-group :label="'Role: '">
        <b-form-select v-model="newUserType" :options="options" class="mb-3"></b-form-select>
      </b-form-group>

      <b-form-group
        :label="'Add user emails (one per row) For Boston College users, add a username or email address. NOTE: BC emails must be the username version (e.g. doeja@bc.edu), not the longer version (e.g. jane.doe@bc.edu). For non-BC users, just add an email address'">
        <b-form-textarea
          id="textarea1"
          v-model="text"
          placeholder="baileyau@bc.edu"
          :rows="3"
          :max-rows="6"
        ></b-form-textarea>
      </b-form-group>
      <b-button type="submit" variant="primary">Add Person</b-button>
    </b-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [
        "Member",
        "Contributor",
        "Collaborator",
        "Editor",
        "Administrator"
      ],
      newUserType: "Member",
      text: ""
    };
  }
};
</script>

