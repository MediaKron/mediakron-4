<template>
    <div class="people">
        <h1>People</h1>
               
        </div>
</template>

<script>
import Vue from 'vue';
import _ from 'underscore';
import data from '@/components/mixins/data';
// import PeopleNav from "./PeopleNav.vue";
import { mapState, mapActions } from 'vuex';
export default  Vue.extend({
    mixins: [ data ],
    components: {
    //  Poeplenav,
    },
    computed:{
        ...mapState('sites', {
            sourceData: 'currentSite'
        })
    },
    methods:{
        ...mapActions('sites', [
            'update',
            'saveSite'
        ]),

        dataChange: _.debounce( function() {
            this.update(this.localData);
        }, 500),

        save(){
            this.saveSite(this.localData);
        },

        cancel(){
        }
    },
    mounted(){
        
    }
});
</script>

<style>

</style>
