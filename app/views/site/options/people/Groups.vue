<template>
  <div>
    <header>
      <h1 class="line-behind heading-nudge-up mb-4"> Manage Groups</h1>
    </header>

    <div class="add-groups">
        <b-btn v-b-toggle.collapse1 variant="primary" size="sm" class="text-uppercase"><font-awesome-icon icon="user-plus"/> Add Groups</b-btn>
        <b-collapse id="collapse1" class="mt-3">
            <b-form @submit.prevent="updateUser">
      
            <b-form-group
              class="mt-2 floating-label"
              label-for="groupid"
              description='For Boston College sites only. Use the format in this example for connecting a course roster to a site: APSY7419012016S. <strong>Important:</strong> for fall courses, use the year associated with the spring semester. For example, a fall 2015 course would be "2016F"'
              >
              <b-form-input
                id="groupid-field"
                v-model="text"
                type="text"
                placeholder="Group ID"
              >
              </b-form-input>
              <label for="groupid-field">Group ID</label>
            </b-form-group>

            <b-form-group label="Role" class="mt-3">
                <b-form-select v-model="newUserType" :options="options" class="mb-3"></b-form-select>
            </b-form-group>

            <b-button type="submit" variant="primary" size="sm" class="text-uppercase"><font-awesome-icon icon="check"/> Add </b-button>
          </b-form>

        </b-collapse>

    </div>

    <h2 class="mt-4">Active Groups</h2>
    <p> No groups have been added.</p>
    

    
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
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

