<template>
<div class="savebar bg-white">
    <div class="savebar-inner container">
        <div class="row">
             <div class="col-md-4" >
             </div>
            <b-button-group class="savebar-buttons p-2 col-md-8">
                <b-button type="submit" variant="primary" @click="save">
                    <font-awesome-icon icon="check"/> Save
                </b-button>
                <b-button type="reset" variant="outline-primary" @click="cancel" class="bg-light cancel-button">
                    <font-awesome-icon icon="times"/> Cancel
                </b-button>
            </b-button-group>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapActions,mapGetters } from 'vuex';
export default  Vue.extend({
    methods:{
        ...mapActions('sites', [
            'saveSite'
        ]),

        save(){
            this.saveSite();
        },
        cancel(){
            console.log('cancel');
        }

    },
    mounted(){
        
    }

});
</script>

<style>

  .savebar {
    position:fixed;
    bottom:0;
    right:0;
    width:100%;
    background: #fff;
    border-top: 1px solid #ccc;
    z-index: 2; /* appear over certain form elements */
    border-top: 1px solid #565656;
}

</style>