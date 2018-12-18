<template lang="html">
    <div class="container mt-5">
        <b-card header-tag="header">
            <h6 slot="header" class="mb-0">Create New Site</h6>
            <b-form>
                <b-form-group
                       label="Uri:">
                   <b-form-input
                                 type="text"
                                 v-model="form.uri"
                                 required
                                 placeholder="">
                   </b-form-input>
                </b-form-group>
                <b-form-group
                       label="Site Title:">
                   <b-form-input
                                 type="text"
                                 v-model="form.title"
                                 required
                                 placeholder="">
                   </b-form-input>
                </b-form-group>
                <b-form-group
                       label="Comments:">
                   <b-form-input
                                 type="textarea"
                                 v-model="form.comment"
                                 placeholder="">
                   </b-form-input>
                </b-form-group>
                <b-form-group
                       label="Ga:">
                   <b-form-input
                                 type="text"
                                 v-model="form.ga"
                                 placeholder="">
                   </b-form-input>
                </b-form-group>

                <b-form-group>
                    <b-form-checkbox-group v-model="form.public">
                        <b-form-checkbox value="public">Public</b-form-checkbox>
                        <b-form-checkbox value="production">Production</b-form-checkbox>
                        <b-form-checkbox value="download">Download</b-form-checkbox>
                   </b-form-checkbox-group>
             </b-form-group>
              <b-form-group
               label="Search Algorithm:">
                <b-form-input  type="text" v-model="form.search_algorithm"
                 placeholder="">
                </b-form-input>
              </b-form-group>
             <b-button type="submit" variant="primary">Submit</b-button>
            </b-form>
        </b-card>

    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                uri: 'uri',
                title: 'site title',
                comment: 'site comment',
                public: ['public'],
                production:['production'],
                download:['download'],
                ga: 'some GA',
                search_algorithm: 'search algorithm'
            }
        }
    }
}
</script>

<style lang="css">
</style>
