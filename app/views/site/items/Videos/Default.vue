<template>
   <div class="container">
       <div v-if="!isEditing">

       </div>
       <b-form-group v-else>
           <b-form-group 
                label="Edit title"
                label-for="title">
                <b-input id="title" :value="itemCopy.title"></b-input>
            </b-form-group>
            <div>
                <h2>{{ itemCopy.title }}</h2>
            </div>
       </b-form-group>
   </div>
</template>

<script>
export default {
    props: [ 'item', 'isEditing' ],
    data() {
        return {
            itemCopy: Object.assign({}, this.item)
        }
    }
}
</script>

<style>

</style>
