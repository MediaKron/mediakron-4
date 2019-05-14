<template>
    <div>
        
        <b-dropdown text="Contexts" variant="link" class="" toggle-class="p-0 text-lg">
            <b-dropdown-item 
                v-for="(item_parent, index) in current.parents" 
                :key="index"
                :href="item_parent.uri">
                {{ item_parent.title }}
            </b-dropdown-item>
        </b-dropdown>
        <div class="mt-2">Current Context: <b-link :to="basePath + '/' + parent.uri">{{ parent.title }}</b-link></div>
        <ul class="pl-2 pt-3 list-none">
            <li v-for="(child, index) in parentChildren" :key="index" class="joined-list" :class="{ 'active' : child.title == current.title}" >
                <b-link :to="child.uri" > {{ child.title  }}</b-link>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    mounted() {
        console.log(Object.keys(this.grandparent).length != 0)
    },
    computed: {
        hasParent() {
            if (this.current.parents.length != 0) return true
        },
        parentChildren() {
            if (Object.keys(this.parent).length != 0) return this.parent.children
            else return false
        },
        ...mapGetters('items', [
            'current',
            'parent',
            'grandparent'
        ]),
        ...mapGetters('sites', [
            'basePath'
        ]),
    }
}
</script>
<style>

.joined-list {
    /* You need to turn on relative positioning so the line is placed relative to the item rather than absolutely on the page */
  position: relative;
  
  /* Use padding to space things out rather than margins as the line would get broken up otherwise */
  margin: 0;
  padding-bottom: 1em;
  padding-left: 20px;
}

/* The actual line being placed before each list item, tweak width and color as appropriate */
.joined-list:before {
  background-color: #000;
  width: 2px;
  content: '';
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 5px;
}

/* Small bullets for normal list items */
.joined-list::after {
  content: '';
  position: absolute;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' viewBox='0 0 32 32' focusable='false'%3E%3Ccircle stroke='none' fill='000  ' cx='16' cy='16' r='10'%3E%3C/circle%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  left: 0;
  top: 2px;
  width: 12px;
  height: 12px;
}

/* Large bullet for the first list item */
.joined-list.active::after {
  content: '';
  width: 16px;
  height: 16px;
  left: -2px;
  top: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' viewBox='0 0 32 32' focusable='false'%3E%3Cpath d='M16 4c6.6 0 12 5.4 12 12s-5.4 12-12 12S4 22.6 4 16 9.4 4 16 4zm0-4C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0z' fill='%23c00'%3E%3C/path%3E%3Ccircle fill='%23c00' cx='16' cy='16' r='6'%3E%3C/circle%3E%3C/svg%3E");
}
    
/* Start the line further down on the first list item */
.joined-list:first-child:before { top: 10px;  }

/* Stop the line short on the final list item */
.joined-list:last-child:before { height: 6px; }
    
a { color: #06e; }

</style>
