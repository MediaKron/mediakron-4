<template>
    <div>
        <b-form-group label="Collection Layout Options" class="list-group m-4">
            <b-form-radio v-model="selected" name="collection-styles" value="list-simple" class="list-group-item pl-10">
                <b-media>
                    <img slot="aside" src="@/assets/layout-icons/collection-list-simple.png" alt="">
                    <h6>Basic List</h6>
                    <p>A list of folder items. Item thumbnail does not appear in layout.</p>
                </b-media>
            </b-form-radio>
            <b-form-radio v-model="selected" name="collection-styles" value="default" class="list-group-item pl-10">
                <b-media>
                    <img slot="aside" src="@/assets/layout-icons/collection-list.png" alt="">
                    <h6>List with image</h6>
                    <p>A list of folder items. If you've uploaded an image for the folder, it will appear above the item list.</p>
                </b-media>
            </b-form-radio>
             <b-form-radio v-model="selected" name="collection-styles" value="list-half" class="list-group-item pl-10">
                <b-media>
                    <img slot="aside" src="@/assets/layout-icons/collection-list-half.png" alt="">
                    <h6>List (half-page image)</h6>
                    <p>A list of folder items with a full-page image header.</p>
                </b-media>
            </b-form-radio>
             <b-form-radio v-model="selected" name="collection-styles" value="list-full" class="list-group-item pl-10">
                <b-media>
                    <img slot="aside" src="@/assets/layout-icons/collection-list-full.png" alt="">
                    <h6>List (full-page image)</h6>
                    <p>A list of folder items with a full-page image header</p>
                </b-media>
            </b-form-radio>
             <b-form-radio v-model="selected" name="collection-styles" value="journal" class="list-group-item pl-10">
                <b-media>
                    <img slot="aside" src="@/assets/layout-icons/collection-list.png" alt="">
                    <h6>Journal</h6>
                    <p>A list of folder items in reverse chronological order.</p>
                </b-media>
            </b-form-radio>
             <b-form-radio v-model="selected" name="collection-styles" value="grid-simple" class="list-group-item pl-10">
                <b-media>
                    <img slot="aside" src="@/assets/layout-icons/collection-grid-simple.png" alt="">
                    <h6>Grid Layout</h6>
                    <p>A grid layout with square thumbnails. If you've uploaded an image for the folder, it will appear as a top banner.</p>
                </b-media>
            </b-form-radio>
             <b-form-radio v-model="selected" name="collection-styles" value="grid-half" class="list-group-item pl-10">
                <b-media>
                    <img slot="aside" src="@/assets/layout-icons/collection-grid.png" alt="">
                    <h6>Grid with half-page header image</h6>
                    <p>A grid layout with square thumbnails. If you've uploaded an image for the folder, it will appear as a top banner.</p>
                </b-media>
            </b-form-radio>
             <b-form-radio v-model="selected" name="collection-styles" value="grid-full" class="list-group-item pl-10">
                <b-media>
                    <img slot="aside" src="@/assets/layout-icons/collection-grid-full.png" alt="">
                    <h6>Grid with full-page header image</h6>
                    <p>A grid layout with square thumbnails. If you've uploaded an image for the folder, it will appear as a top banner.</p>
                </b-media>
            </b-form-radio>
             <b-form-radio v-model="selected" name="collection-styles" value="mosaic" class="list-group-item pl-10">
                <b-media>
                    <img slot="aside" src="@/assets/layout-icons/collection-mosaic.png" alt="">
                    <h6>Mosaic thumbnail layout</h6>
                    <p>Folder items with thumbnail images in their original aspect ratios.</p>
                </b-media>
            </b-form-radio>
             <b-form-radio v-model="selected" name="collection-styles" value="table" class="list-group-item pl-10">
                <b-media>
                    <img slot="aside" src="@/assets/layout-icons/collection-table.png" alt="">
                    <h6>Table</h6>
                    <p>A table layout with item details.</p>
                </b-media>
            </b-form-radio>
        </b-form-group>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                selected: ''
            }
        }
    }
</script>