<template>
    <div id="picker" class="draggable">
        <div id="drag-bar" @mousedown="mouseDown"></div>
        <Chrome v-model="color"/>
        {{ mouseIsDown }}
    </div>
</template>

<script>
import { Chrome } from 'vue-color'
export default {
    components: {
        Chrome
    },
    props: ['color'],
    data() {
        return {
            mouseIsDown: false,
            mousePosition: {
                x: null,
                y: null,
            },
            color: {}
        }
    },
    mounted() {
        document.addEventListener('mouseup', this.mouseUp) 
    },
    methods: {
        mouseDown($event) {
            this.mouseIsDown = true
            this.mousePosition.x = event.clientX
            this.mousePosition.y = event.clientY
            document.addEventListener('mousemove', this.mouseMove)
        },
        mouseMove($event) {
            var picker = document.getElementById('picker')
            var tempX = this.mousePosition.x - event.clientX
            var tempY = this.mousePosition.y - event.clientY
            picker.style.left = (picker.offsetLeft - tempX) + "px"
            picker.style.top = (picker.offsetTop - tempY) + "px"
            this.mousePosition.x = event.clientX
            this.mousePosition.y = event.clientY
        },
        mouseUp($event) {
            this.mouseIsDown = false
            document.removeEventListener('mousemove', this.mouseMove)
        }
    }
}
</script>
<style>
.draggable {
    position: absolute;
    z-index: 5;
}

#drag-bar {
    height: 15px;
    background-color: #225362;
}
</style>


