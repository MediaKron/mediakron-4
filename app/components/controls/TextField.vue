<template>
    <!-- {{ name }} Text Field-->
    <div class="field" :v-bind:class="fieldclass">
        <label :for="name" class="sr-only">{{ label }}:</label>
        <content-editable 
            :id="id" 
            :aria-labelledby="aria" 
            :data-placeholder="placeholder"></content-editable>
    </div>
</template>

<script>
import ContentEditable from './ContentEditable';
export default { 
    components:{
        ContentEditable
    },
    props: { 
        id: String, 
        name: String,
        placeholder: String, 
        aria: String,
        help: String,
        label: String,
        content: String
    },
    computed:{
        fieldclass(){
            if(this.for){
                return this.for + '-class';
            }
            return '';
        }
    }
}
</script>

<style>

</style>
