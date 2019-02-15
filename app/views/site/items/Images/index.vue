<template>
    <div>
        <div>
            <b-button class="float-right" @click="isEditing = !isEditing">{{ getEditPrompt }}</b-button>
        </div>
        <component :is="component" :item="item" :isEditing="isEditing"/>
    </div>
</template>

<script>
import Default from './Default'
import Full from './Full'
export default {
    props: [ 'item' ],
    computed: {
        component(){
            switch(this.item.template){
                case 'full':
                    return Full;
                default:
                    return Default;
            }
            
        },
        getEditPrompt() {
            if (this.isEditing) return 'Save'
            return 'Edit'
        },
    },
    data() {
        return {
            isEditing: false
        }
    },
    
}
</script>

<style>

</style>
