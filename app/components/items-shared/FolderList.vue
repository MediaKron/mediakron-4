<template>
    <b-card no-body header="Folder Items">
        <b-list-group flush>
            <b-list-group-item v-for="(child, index) in children" :key="index">
                <b-img src="https://picsum.photos/300?image=342" fluid alt="Responsive image" />
                {{ child.title }}
            </b-list-group-item>
        </b-list-group>
    </b-card>
   
</template>

<script>
export default {
    props: [ 'children' ],
    data() {
        return {
            image: 'https://picsum.photos/300?image=342',
        }
    }
}
</script>
