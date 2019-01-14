<template>
<div class="savebar ">
    <div class="savebar-inner container">
        <div class="row">
             <div class="col-md-4" >
             </div>
            <b-button-group class="savebar-buttons p-2 col-md-8">
                <b-button type="submit" variant="primary"><font-awesome-icon icon="check"/> Save</b-button>
                <b-button type="reset" variant="outline-primary" class="cancel-button bg-white"><font-awesome-icon icon="times"/> Cancel</b-button>
            </b-button-group>
        </div>
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
    background: #fff;
    border-top: 1px solid #ccc;
}

</style>