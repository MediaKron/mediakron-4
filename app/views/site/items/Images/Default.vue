<template>
    <div class="container">
        <div v-if="!isEditing">
            <h2>{{ itemCopy.title }}</h2>
            <p>{{ itemCopy.description }}</p>
            <h5>Image File</h5>
            <b-img :src="this.images[0]" fluid thumbnail alt="Responsive image"/>
            <p>{{ itemCopy.caption }}</p>
            <div v-if="itemCopy.metadata && itemCopy.metadata.citation">
                <h5>Source</h5>
                <p>{{ itemCopy.metadata.citation }}</p>
            </div>
        </div>
        <b-form class="container" v-else>
            <b-form-group
                label="Edit title"
                label-for="title">
                <b-form-input id="title" v-model="itemCopy.title"></b-form-input>
            </b-form-group>
            <b-form-group
                label="Edit description"
                label-for="description">
                <b-form-textarea id="description" v-model="itemCopy.description" rows="3"></b-form-textarea>
            </b-form-group>
            <b-form-group
                label="Replace Image"
                label-for="fileUpload">
                <b-form-file
                    v-model="itemCopy.newImage"
                    :state="Boolean(itemCopy.newImage)"
                    placeholder="Choose a file..."
                    drop-placeholder="Drop file here..."
                    accept=".jpg, .png, .gif"/>
            </b-form-group>
            <b-form-group
                label="Edit Caption"
                label-for="caption">
                <b-form-input id="caption" v-model="itemCopy.caption"></b-form-input> 
            </b-form-group>
            <b-form-group
                label="Edit Citation"
                label-for="source">
                <b-form-textarea id="source" v-model="itemCopy.metadata.citation" rows="3" placeholder="Add Citation Here"></b-form-textarea>
            </b-form-group>
            
        </b-form>
    </div>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import Vue from 'vue'

export default {
    props: [ 'item', 'isEditing' ],
    data() {
        return {
            images: [
                'https://picsum.photos/300?image=342',
            ],
            itemCopy: Object.assign({}, this.item)
        }
    },
    created() {
        console.log(this.itemCopy)
    },
    methods: {

    }
}
</script>

<style>

</style>
