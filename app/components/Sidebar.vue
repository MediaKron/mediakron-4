<template>
  <aside id="sidebar" class="hidden lg:block pb-12 pl-2 pr-4 bg-dark">
         <div class="lg:relative lg:sticky top-0 pt-2">
                <div class="sticky?lg:h-(screen-8) overflow-y-auto">
                     <slot></slot>
                </div>
        </div>
    </aside>
</template>

<script>


</script>

<style>

    #sidebar .nav-link {
        display: flex;
        color: #ddd;
    }

    #sidebar .nav-link.active {
        display: flex;
        color: #fff !important;
        font-weight: bold;
        background: none !important;
        font-size: 105%
    }

    #sidebar .nav-link.active svg {
        background: #fff;
    }

    #sidebar .nav-link svg {
        display: flex;
        align-items: center;
        color: #333;
        background: #ddd;
        padding: .25rem;
        border-radius: .2rem;
        font-size: 1.5rem;
        width: 1.5rem;
    }
   
</style>
