<template>
    <div>
        <b-form class="container">
            <b-form-group v-if=isEditing
                label="Edit title"
                label-for="title">
                <b-input v-if="isEditing" id="title" :value="itemCopy.title"></b-input>
            </b-form-group>
            <div v-else>
                <div>{{ itemCopy.title }}</div>
            </div>
            <b-form-group v-if=isEditing
                          label="Edit description"
                          label-for="description">
                <b-input v-if="isEditing" id="description" :value="itemCopy.description"></b-input>
            </b-form-group>
            <div v-else>
                <div>{{ itemCopy.description }}</div>
            </div>
            <b-form-group v-if=isEditing
                          label="replace image file"
                          label-for="fileUpload">
                <b-form-file
                        v-model="file"
                        :state="Boolean(file)"
                        placeholder="Choose a file..."
                        drop-placeholder="Drop file here..."
                />
            </b-form-group>
            <div v-else>
                <viewer :images="images">
                    <img v-for="src in images" :src="src" :key="src">
                </viewer>
                <div>{{ itemCopy.uri }}</div>
            </div>
        </b-form>
    </div>
</template>

<script>
    import 'viewerjs/dist/viewer.css'
    import Viewer from 'v-viewer'
    import Vue from 'vue'
    Vue.use(Viewer)
export default {
    components: {
        Viewer
    },
    props: [ 'item', 'isEditing' ],
    data() {
        return {
        images: ['https://picsum.photos/300?image=342',
            'https://picsum.photos/200?image=1074',
            'https://picsum.photos/200/300?image=446',
            'https://picsum.photos/300?image=973',
            'https://picsum.photos/200/300?image=459',
            'https://picsum.photos/200/300?image=1075',
            'https://picsum.photos/200?image=1077',
            'https://picsum.photos/200/300?image=352',
            'https://picsum.photos/200/300?image=323',],

            itemCopy: Object.assign({}, this.item)
        }
    }
}
</script>

<style>

</style>
