<template>
<div class="savebar sticky pin-b pin-r bg-white pt-3 pb-12 mt-12 ">
    <div class="w-full ">
        <div class="flex">
            <div class="savebar-buttons  ">
                <b-button type="submit" variant="primary" @click="save" class="mr-2 shadow"><font-awesome-icon icon="check"/> Save</b-button>
                <b-button type="reset" variant="outline-primary" @click="cancel" class="bg-light cancel-button shadow"><font-awesome-icon icon="times"/> Cancel</b-button>
            </div >
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
    /* position:sticky;
    bottom:0;
    right:0; */
    width:100%;
    background: #fff;
    /* border-top: 1px solid #ccc; */
    /* z-index: 2; /* appear over certain form elements */
    /* border-top: 1px solid #565656; */ 
}

</style>