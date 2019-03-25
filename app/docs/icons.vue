<template lang="html">
  <div class="container mt-5">
      <h1>Icons</h1>
    <p class="py-4">
      These are the icons used in MediaKron. 
    </p>
     <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" />
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
     </b-input-group>
    <b-table :items="items" :fields="fields" :filter="filter" @filtered="onFiltered">
      <template slot="icon" slot-scope="data">
        <font-awesome-icon :icon="data.value"/> 
      </template>
      <template slot="code" slot-scope="data">
        &lt;font-awesome-icon icon="{{data.value}}" /&gt; 
      </template>
    </b-table>

  </div>
</template>

<script>
export default {
    data() {
      return {
        fields: {
          icon: {
          label: "Icon",
            sortable: true
          },
          name: {
            label: "Name",
            sortable: true
          },
          code: {
          label: "Vue Snippet",
          sortable: true
          },
          mknotes: {
          label: "MediaKron Notes",
          sortable: true
          },
       },
        items: [
          {name: 'Archive', icon: 'archive', code: 'archive', mknotes:' '},
          {name: 'Arrow Down', icon: 'arrow-down', code: 'arrow-down', mknotes:' '},
          {name: 'Arrow Left', icon: 'arrow-left', code: 'arrow-left', mknotes:' '},
          {name: 'Arrow Right', icon: 'arrow-right', code: 'arrow-right', mknotes:' '},
          {name: 'Arrow Up', icon: 'arrow-up', code: 'arrow-up', mknotes:' '},
          {name: 'Asterisk', icon: 'asterisk', code: 'asterisk', mknotes:' '},
          {name: 'Check', icon: 'check', code: 'check', mknotes:' '},
          {name: 'Chevron Down', icon: 'chevron-down', code: 'chevron-down', mknotes:' '},
          {name: 'ChevronLeft ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'ChevronRight ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'ChevronUp ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'Cog ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'Cogs ', icon: ' ', code: ' ', mknotes:' Manage (Remove?'}, 
          {name: 'Edit', icon: ' ', code: ' ', mknotes:' '},
          {name: 'EllipsisV ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'ExpandArrowsAlt ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'Home ', icon: ' ', code: ' ', mknotes:' '}, 
          {name: 'Image ', icon: 'image', code: 'image', mknotes:'Item:image '}, 
          {name: 'InfoCircle, ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'List ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'PaintBrush ', icon: ' ', code: ' ', mknotes:'Appearance '}, 
          {name: 'Plus ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'PlusSquare ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'QuestionCircle ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'Search ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'SignInAlt ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'SignOutAlt ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'Sitemap ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'SlidersH ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'Spinner ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'Tag ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'Tags ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'Th ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'ThList ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'ThLarge', icon: ' ', code: ' ', mknotes:' '},
          {name: 'Times ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'TrashAlt ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'User ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'UserCircle ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'UserCog ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'UserEdit ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'UserPlus ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'Users ', icon: ' ', code: ' ', mknotes:' '},
          {name: 'Volume Up', icon: 'volume-up', code: 'volume-up', mknotes:'item:audio '},
          {name: 'WindowClose ', icon: ' ', code: ' ', mknotes:'Close square '}
        ],
        filter: null,

      }
    }
  }
</script>

<style lang="css">
</style>
