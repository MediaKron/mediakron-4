<template lang="html">
  <div class="c-docs-home container max-w-xl mt-20">
    <h1 class="line-behind">MediaKron Documentation</h1>
    <div class="mt-12 max-w-sm">
     <h2 class="mb-3 lg:mb-2 uppercase tracking-wide text-3xl">Getting Started</h2>
        <b-nav vertical pills class="">
        <b-nav-item :to="basePath + '/options/settings/general'" class="text-3xl">
            <span >Settings</span>
        </b-nav-item> 
        <b-nav-item :to="basePath + '/options/menus'" class="text-3xl">
            <span >Menus</span>
        </b-nav-item> 
      </b-nav>  
      </div>
              
  </div>
</template>

<script>

</script>

<style>
  .c-docs-home .nav-link.active {
    @apply font-bold;
  }
</style>