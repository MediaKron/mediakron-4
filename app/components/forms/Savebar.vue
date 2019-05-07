<template>
<div class="savebar">
    <div class="savebar-inner">
        <b-button-group class="savebar-buttons p-2">
            <b-button type="submit" variant="dark"><font-awesome-icon icon="check"/> Save</b-button>
            <b-button type="reset" variant="outline-dark" class="cancel-button bg-white"><font-awesome-icon icon="times"/> Cancel</b-button>
        </b-button-group>
    </div>
</div>
</template>

<script>

</script>

<style>

  .savebar {
    position:fixed;
    bottom:0;
    right:0;
    width:100%;
    background: #fafafa;
    border-top: 1px solid #ccc;
}

</style>