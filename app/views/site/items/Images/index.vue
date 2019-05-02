<template>
    <div>
        <component :is="component" :item="item"/>
        <div class="right-0 top-0 fixed mr-4 mt-20 flex flex-column ">
            <b-button v-if="!isEditing" class="uppercase mb-2 flex flex-column items-center bg-light border-none item-button " variant="outline-dark" size="sm" @click="editClicked"><font-awesome-icon icon="edit" class="text-lg mt-1"/> <span class="text-xs mt-1">Edit</span></b-button>  
            <b-button v-if="isEditing" class="uppercase" variant="outline-dark" size="lg" @click="saveClicked"> <font-awesome-icon icon="check" /> Save </b-button>       
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
.btn.item-button {
    padding-left: .5rem;
    padding-right: .5rem;
}
</style>
