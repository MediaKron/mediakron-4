<template>
<div>
    <b-card-group deck class="flex-wrap">
        <b-card title="Title" 
                img-src="https://picsum.photos/300/300/?image=41"
                img-alt="Img"
                img-top>
            <p class="card-text">
            <b-dropdown id="ddown-dropup" dropup text="Option"  class="m-2">
                <b-dropdown-item href="#">Action</b-dropdown-item>
                <b-dropdown-item href="#">Another action</b-dropdown-item>
                <b-dropdown-item href="#">Something else here</b-dropdown-item>
            </b-dropdown>
            </p>
            <div slot="footer">
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
        </b-card>
        <b-card title="Title"
                img-src="https://picsum.photos/300/300/?image=41"
                img-alt="Img"
                img-top>
            <p class="card-text">
                This card has supporting text below as a natural lead-in
                to additional content.
            </p>
            <div slot="footer">
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
        </b-card>
        <b-card title="Title"
                img-src="https://picsum.photos/300/300/?image=41"
                img-alt="Img"
                img-top>
            <p class="card-text">
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This card has even longer content
                than the first to show that equal height action.
            </p>
            <div slot="footer">
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
        </b-card>
        <b-card title="Title"
                img-src="https://picsum.photos/300/300/?image=41"
                img-alt="Img"
                img-top>
            <p class="card-text">
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This card has even longer content
                than the first to show that equal height action.
            </p>
            <div slot="footer">
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
        </b-card>
        <b-card title="Title"
                img-src="https://picsum.photos/300/300/?image=41"
                img-alt="Img"
                img-top>
            <p class="card-text">
                This is a wider card with supporting text below as a natural
                lead-in to additional content. This card has even longer content
                than the first to show that equal height action.
            </p>
            <div slot="footer">
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
        </b-card>
    </b-card-group>
</div>
</template>

<script>


</script>

<style scoped>

.card-deck .card {
    flex: 0 0 20%;
    margin: 0 .5rem 1rem .5rem;
}

</style>
