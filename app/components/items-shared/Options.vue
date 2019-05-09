<template>
    <b-dropdown variant="outline-dark" size="lg" right no-caret toggle-class="flex flex-column items-center bg-light border-none item-button ">
        <template slot="button-content">
           <font-awesome-icon icon="ellipsis-h" class="mr-1" /><span class="uppercase options">Options</span>
        </template>
        <b-dropdown-item href="#">
            <font-awesome-icon icon="retweet" class="mr-1"/><span class="button-text">Revisions </span>
        </b-dropdown-item>
        <b-dropdown-item href="#">
            <font-awesome-icon icon="trash-alt" class="mr-1"/> <span>Delete</span>
        </b-dropdown-item>
        <b-dropdown-item href="#">
            <font-awesome-icon icon="minus-circle" class="mr-1"/> <span class="button-text">Unpublish</span>
        </b-dropdown-item>
        <b-dropdown-item href="#">
            <font-awesome-icon icon="clone" class="mr-1"/> <span class="button-text">Duplicate</span>
        </b-dropdown-item>
        <b-dropdown-item href="#">
            <font-awesome-icon icon="archive" class="mr-1"/><span class="button-text">Archive</span>
        </b-dropdown-item>
        <b-dropdown-item href="#">
            <font-awesome-icon icon="lock" class="mr-1"/> <span class="button-text">Lock</span>
        </b-dropdown-item>
        <b-dropdown-item href="#">
            <font-awesome-icon icon="share-square" class="mr-1"/>  <span class="button-text">Copy to Site</span>
        </b-dropdown-item>
    </b-dropdown>
</template>

<script>
  
</script>

<style>
.options {
    font-size: .5rem;
}
</style>