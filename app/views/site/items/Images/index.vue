<template>
    <div>
        <div class="pin-r fixed mr-3 mt-8">
            <b-button class=" " variant="primary" @click="editClicked"> {{ getEditPrompt }}</b-button>       
            <b-alert class="pin-r fixed mt-4 mr-3" :show="editAlert" variant="success">
                <p>You are now in editing mode.</p>
            </b-alert> 
            <b-alert class="pin-r fixed mt-4 mr-3" :show="saveAlert" variant="success">
                <p>Changes Saved.</p>
            </b-alert> 
        </div>
        <component :is="component" :item="item"/>
    </div>
</template>

<script>
import Default from './Default'
import Full from './Full'
import editable from '~/components/mixins/editable';
import { mapGetters, mapActions } from 'vuex'
export default {
    mixins: [ editable ],
    props: [ 'item' ],
    methods:{},
    computed: {
        component(){
            switch(this.item.template){
                case 'full':
                    return Full;
                default:
                    return Default;
            }
            
        },
    }
}
</script>

<style>

</style>
