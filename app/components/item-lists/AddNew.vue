<template>
    <div class="p-8">
        <h2 class="mb-4">Content Organizers</h2>
        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full">
                <font-awesome-icon icon="folder" /><span class="mr-auto ml-2"> Collections</span>
            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>
        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full">
                <font-awesome-icon icon="file-alt" /><span class="mr-auto ml-2"> Stories</span>
            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>

        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full">
                <font-awesome-icon icon="map-marker-alt" /><span class="mr-auto ml-2"> Maps</span>
            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>

        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full">
                <font-awesome-icon icon="clock" /><span class="mr-auto ml-2"> Timelines</span>
            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>
        <h2 class="mt-5 mb-4">Individual Media</h2>
        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full" v-b-modal.add-image>
                <font-awesome-icon icon=image /><span class="mr-auto ml-2"> Images</span>
            </b-button>
            <b-modal size="2xl" centered id="add-image" title="Add Image" hide-footer>
                Add image form here
            </b-modal>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>

        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full">
                <font-awesome-icon icon="video" /> <span class="mr-auto ml-2">Videos</span>

            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>

        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full">
                <font-awesome-icon icon="file" /><span class="mr-auto ml-2"> Files</span>

            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>

        <b-button-group class="flex mb-3">
            <b-button variant="outline-dark" size="lg" class="text-left flex-1 w-full"
                :to="basePath + '/content/add/audio'">
                <font-awesome-icon icon="volume-up" /><span class="mr-auto ml-2"> Audio</span>

            </b-button>
            <b-button variant="outline-dark" size="lg">
                <font-awesome-icon icon="question-circle" /><span class="sr-only"></span>
            </b-button>
        </b-button-group>



    </div>
</template>

<script>
    export default {

    }
</script>