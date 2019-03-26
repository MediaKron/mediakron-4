<template>
    <div>
        <component :is="component" :item="item"/>
        <div class="right-0 top-0 fixed mr-4 mt-20">
            <b-button v-if="!isEditing" class=" " variant="primary" @click="editClicked"> Edit</b-button>  
            <b-button v-if="isEditing" class=" " variant="primary" @click="saveClicked"> Save </b-button>       
            <b-alert class="right-0 fixed mt-4 mr-3" :show="editAlert" variant="success">
                <p>You are now in editing mode.</p>
            </b-alert> 
            <b-alert class="right-0 fixed mt-4 mr-3" :show="saveAlert" variant="success">
                <p>Changes Saved.</p>
            </b-alert> 
        </div>
    </div>
</template>

<script>
import Default from './Default'
import editable from '~/components/mixins/editable';
export default {
    mixins: [ editable ],
    props: [ 'item' ],
    computed: {
        component(){
            switch(this.item.template){
                default:
                    return Default;
            }
            
        },
    }
}
</script>

<style>

</style>
