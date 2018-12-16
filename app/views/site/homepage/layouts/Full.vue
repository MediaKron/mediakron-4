<template>
    <div>
        This is thefull screen component

        {{ item.title }}
        <ul>
            <li v-for="comment in commentsForCurrentItem" v-bind:key="comment.id">{{comment.title}}</li>
        </ul>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
export default {
    prop:['item'],
    computed:{
        ...mapGetters('comments', [
            'commentsForCurrentItem'
        ])
    }
}
</script>

<style>

</style>
