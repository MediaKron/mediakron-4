<template>
<div class="savebar bg-white">
    <div class="w-full max-w-xl mx-auto px-6 ">
        <div class="flex">
             <div class="hidden min-w-64 max-w-xs lg:block ">
            </div>
            <div class="savebar-buttons p-2 px-6 w-full max-w-lg">
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