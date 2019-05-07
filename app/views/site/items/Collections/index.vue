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
import ListSimple from './ListSimple'
import ListHalf from './ListHalf'
import ListFull from './ListFull'
import GridSimple from './GridSimple'
import GridHalf from './GridHalf'
import GridFull from './GridFull'
import Journal from './Journal'
import Mosaic from './Mosaic'
import Table from './Table'
import editable from '~/components/mixins/editable'
export default {
    props: [ 'item' ],
    mixins: [ editable ],
    computed: {
        component(){
            switch(this.item.template){
                case 'list-simple':
                    return ListSimple;
                case 'list-half':
                    return ListHalf;
                case 'list-full':
                    return ListFull;
                case 'grid-simple':
                    return GridSimple;
                case 'grid':
                    return GridHalf;
                case 'grid-full':
                    return GridFull;
                case 'journal':
                    return Journal;
                case 'folder-mosaic':
                    return Mosaic;
                case 'table':
                    return Table;
                default:
                    return Default;
                }
            }
    }
}
</script>

<style>

</style>
