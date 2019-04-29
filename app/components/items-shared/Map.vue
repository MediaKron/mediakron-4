<template>
    <div class="mk-map" v-if="itemIsLoaded">
        <l-map
         style="min-height:500px; height: 100%; width: 100%"
        :zoom.sync="first.getZoom()"
        :center="first.getCenter()"
        :options="{zoomControl: true}">
            <l-tile-layer
                :url="first.getTiles()"
                :attribution="first.getAttribution()" />

            <l-marker v-for="marker in first.children" v-bind:key="marker.id" :lat-lng="marker.coordinate">
                <l-popup>{{ marker.title }} </l-popup>
            </l-marker>
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
        LLayerGroup,
        LPopup
        
    } from 'vue2-leaflet'
import { mapGetters } from 'vuex'

export default {
    components:{
        LMap,
        LTileLayer,
        LMarker,
        LPolyline,
        LLayerGroup,
        LPopup
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
    },
    methods: {
        openPopUp (latLng, caller) {
            this.caller = caller;
            this.$refs.features.mapObject.openPopup(latLng);
        }
    }
}
</script>

<style>

.mk-map .leaflet-popup-content-wrapper, 
.mk-map .leaflet-popup-tip {
    border-radius: .25rem;
}

.mk-map .leaflet-container a.leaflet-popup-close-button {
    color: #565656;
}

.mk-map .leaflet-pane {
    z-index:0; 
}

</style>
