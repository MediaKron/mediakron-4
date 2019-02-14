<template>
<div>
    <b-card-group deck class="flex-wrap">
       
      <b-card title="Title" 
                img-src="https://picsum.photos/300/300/?image=41"
                img-alt="Img"
                img-top>

                <div slot="header" size="sm"
                class="mb-0"> Image </div>


            <p class="card-text">
            <b-dropdown id="ddown-lg" size="sm" text="Options" class="mr-2">
                <b-dropdown-item-button>Action</b-dropdown-item-button>
                <b-dropdown-item-button>Another action</b-dropdown-item-button>
                <b-dropdown-item-button>Something else here</b-dropdown-item-button>
            </b-dropdown>
            <b-dropdown id="ddown-lg" size="sm" text="View In" class="">
                <b-dropdown-item-button>Action</b-dropdown-item-button>
                <b-dropdown-item-button>Another action</b-dropdown-item-button>
                <b-dropdown-item-button>Something else here</b-dropdown-item-button>
            </b-dropdown>

            
            </p>
            <div slot="footer">
                 <b-badge variant="success" class="mr-1">Success</b-badge>
                <b-badge variant="warning" class="mr-1" >Warning</b-badge>
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
        </b-card>
  <b-card title="Title" 
                img-src="https://picsum.photos/300/300/?image=41"
                img-alt="Img"
                img-top>

                <div slot="header"
                class="mb-0"> Image </div>


            <p class="card-text">
            <b-dropdown id="ddown-lg" size="sm" text="Options" variant="outline-dark" class="mr-2">
                <b-dropdown-item-button>Action</b-dropdown-item-button>
                <b-dropdown-item-button>Another action</b-dropdown-item-button>
                <b-dropdown-item-button>Something else here</b-dropdown-item-button>
            </b-dropdown>
            <b-dropdown id="ddown-lg" size="sm" text="View In" class="">
                <b-dropdown-item-button>Action</b-dropdown-item-button>
                <b-dropdown-item-button>Another action</b-dropdown-item-button>
                <b-dropdown-item-button>Something else here</b-dropdown-item-button>
            </b-dropdown>

            
            </p>
            <div slot="footer">
                 <b-badge variant="success" class="mr-1">Success</b-badge>
                <b-badge variant="danger"  class="mr-1">Danger</b-badge>
                <b-badge variant="warning" class="mr-1" >Warning</b-badge>
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
        </b-card>
          <b-card title="Title" 
                img-src="https://picsum.photos/300/300/?image=41"
                img-alt="Img"
                img-top>

                <div slot="header"
                class="mb-0"> Image </div>


            <p class="card-text">
            <b-dropdown id="ddown-lg" size="sm" text="Options" class="mr-2">
                <b-dropdown-item-button>Action</b-dropdown-item-button>
                <b-dropdown-item-button>Another action</b-dropdown-item-button>
                <b-dropdown-item-button>Something else here</b-dropdown-item-button>
            </b-dropdown>
            <b-dropdown id="ddown-lg" size="sm" text="View In" class="">
                <b-dropdown-item-button>Action</b-dropdown-item-button>
                <b-dropdown-item-button>Another action</b-dropdown-item-button>
                <b-dropdown-item-button>Something else here</b-dropdown-item-button>
            </b-dropdown>

            
            </p>
            <div slot="footer">
                 <b-badge variant="success" class="mr-1">Success</b-badge>
                <b-badge variant="danger"  class="mr-1">Danger</b-badge>
                <b-badge variant="warning" class="mr-1" >Warning</b-badge>
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
