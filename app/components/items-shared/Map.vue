<template>
    <div v-if="itemIsLoaded">
        <l-map
        :zoom.sync="first.zoom()"
        :center="first.center()"
        :options="option1"
        :bounds="first.bounds()"
        :min-zoom="first.minZoom()"
        :max-zoom="first.maxZoom()"
        style="height: 45%">
            <l-tile-layer
                :url="first.tiles()"
                :attribution="first.attribution()" />
        </l-map>
    </div>
</template>

<script>
import {
        LMap, 
        LTileLayer,
        LMarker,
        LPolyline,
        LPolygon,
        LLayerGroup
    } from 'vue2-leaflet'
import { mapGetters } from 'vuex'

export default {
    components:{
        LMap,
        LTileLayer,
        LMarker,
        LPolyline,
        LLayerGroup
    },
    computed: {
        ...mapGetters('items', [
            'editItem',
            'isEditing',
            'itemIsLoaded',
            'first'
        ]),
        options(){
            return {};
        },
    },
    mounted(){
        console.log(this.first)
    }
}
</script>

<style>

</style>
