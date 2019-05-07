<template>
    <div>
        <component :is="component" :item="item"/>
        <div class="right-0 top-0 fixed mr-4 mt-20">
            <b-button v-if="!isEditing" class="uppercase" variant="outline-dark" size="sm" @click="editClicked"><font-awesome-icon icon="edit" /> Edit</b-button>  
            <b-button v-if="isEditing" class="uppercase" variant="outline-dark" size="sm" @click="saveClicked"> <font-awesome-icon icon="check" /> Save </b-button>       
            
            <!-- <b-toast id="save-message" variant="success" solid toaster="b-toaster-top-right" no-close-button="true">
                <div slot="default">
                     <font-awesome-icon icon="check" /> Changes Saved.
                </div>
            </b-toast>
            <b-toast id="editing-message" variant="warning" solid toaster="b-toaster-top-right" no-close-button=true>
                <div slot="default">
                     You are now in editing mode..
                </div>
            </b-toast> -->
        
            <m-options></m-options>
        </div>
        
    </div>
</template>

<script>
import Default from './Default'
import editable from '~/components/mixins/editable';
import MOptions from '@/components/items-shared/Options'
import { mapGetters, mapActions } from 'vuex'
export default {
    components: {
        MOptions
    },
    mixins: [ editable ],
    props: [ 'item' ],
    methods:{},
    mounted(){
    },
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
