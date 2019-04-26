<template>
    <b-dropdown class="item-options ml-2" variant="outline-dark" size="sm" right>
        <template slot="button-content">
           <font-awesome-icon icon="ellipsis-v" class="mr-1" /><span class="uppercase">Options</span>
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

</style>