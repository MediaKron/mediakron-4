<template>
  <div class="groups w-full mx-auto max-w-5xl">
    <main role="main" class="">
      <header>
        <h1 class="line-behind heading-nudge-up mb-4">Groups</h1>
      </header>

      <div class="add-groups">
        <b-btn v-b-modal.add-group-form variant="primary" class="text-uppercase">
          <font-awesome-icon icon="user-plus" /> Add Groups</b-btn>
        <b-modal id="add-group-form" centered title="Add Groups" ok-title="Save">
          <b-form @submit.prevent="updateUser">

            <b-form-group class="mt-2 floating-label" label-for="groupid"
              description='For Boston College sites only. Use the format in this example for connecting a course roster to a site: APSY7419012016S. <strong>Important:</strong> for fall courses, use the year associated with the spring semester. For example, a fall 2015 course would be "2016F"'>
              <b-form-input id="groupid-field" v-model="text" type="text" placeholder="Group ID">
              </b-form-input>
              <label for="groupid-field">Group ID</label>
            </b-form-group>

            <b-form-group label="Role" class="mt-3">
              <b-form-select v-model="newUserType" :options="options" class="mb-3"></b-form-select>
            </b-form-group>
            <template slot="modal-ok">
                  ok
                </template>
          </b-form>
        </b-modal>
      </div>

      <p class="mt-3"> No groups have been added.</p>
    </main>
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex';
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