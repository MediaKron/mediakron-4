<template lang="html">
  <div class="container mt-5">
      <h1>Icons</h1>
    <p class="pt-0 pb-3">
      These are the icons used in MediaKron. 
    </p>
    <b-input-group class="mb-3">
          <b-form-input v-model="filter" placeholder="Type to Search" />
          <b-input-group-append>
            <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
          </b-input-group-append>
    </b-input-group>
    <b-table :items="items" :fields="fields" :filter="filter" @filtered="onFiltered" sortBy="mkname" stacked="md">
      <template slot="icon" slot-scope="data">
        <font-awesome-icon :icon="data.value" class="text-3xl"/> 
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
          mkname: {
          label: "MediaKron Info",
          sortable: true
          },
          code: {
          label: "Vue Snippet",
          sortable: true
          },
          faname: {
            label: "Font-Awesome Name",
            sortable: true
          },
        },
        items: [
          {faname: 'Archive', icon: 'archive', code: 'archive', mkname:'Archive'},
          {faname: 'Arrow Down', icon: 'arrow-down', code: 'arrow-down', mkname:'Arrow Down'},
          {faname: 'Arrow Left', icon: 'arrow-left', code: 'arrow-left', mkname:'Arrow Left'},
          {faname: 'Arrow Right', icon: 'arrow-right', code: 'arrow-right', mkname:'Arrow Right'},
          {faname: 'Arrow Up', icon: 'arrow-up', code: 'arrow-up', mkname:'Arrow Up'},
          {faname: 'Arrows Alt-V', icon: 'arrows-alt-v', code: 'arrows-alt-v', mkname:'Organize'},
          {faname: 'Asterisk', icon: 'asterisk', code: 'asterisk', mkname:'Asterisk'},
          {faname: 'Bars', icon: 'bars', code: 'bars', mkname:'Menu'},
          {faname: 'Check', icon: 'check', code: 'check', mkname:'Save'},
          {faname: 'Chevron Down', icon: 'chevron-down', code: 'chevron-down', mkname:'Chevron Down'},
          {faname: 'Chevron Left', icon: 'chevron-left', code: 'chevron-left', mkname:'Chevron Left '},
          {faname: 'Chevron Right', icon: 'chevron-right', code: 'chevron-right', mkname:'Chevron Right'},
          {faname: 'Chevron Up', icon: 'chevron-up', code: 'chevron-up', mkname:'Chevron Up '},
          {faname: 'Clock', icon: 'clock', code: 'clock', mkname:'Item: Timeline'}, 
          {faname: 'Cog ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'Cogs ', icon: ' ', code: ' ', mkname:' Manage (Remove?'}, 
          {faname: 'Edit', icon: 'edit', code: 'edit', mkname:'Edit'},
          {faname: 'Folder', icon: 'folder', code: 'folder', mkname:'Item: Folder (Collection)'},
          {faname: 'EllipsisV ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'ExpandArrowsAlt ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'File', icon: 'file', code: 'file', mkname:'Item: File '},
          {faname: 'File Alt', icon: 'file-alt', code: 'file-alt', mkname:'Item: Story'},
          {faname: 'Grip Lines', icon: 'grip-lines', code: 'grip-lines', mkname:'Drag Handles'},
          {faname: 'Home ', icon: ' ', code: ' ', mkname:' '}, 
          {faname: 'Image ', icon: 'image', code: 'image', mkname:'Item: Image '}, 
          {faname: 'InfoCircle, ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'Map Marker Alt, ', icon: 'map-marker-alt', code: 'map-marker-alt', mkname:'Item: Map '},
          {faname: 'Link ', icon: 'link', code: 'link', mkname:'Link'},
          {faname: 'List ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'PaintBrush ', icon: 'paint-brush', code: 'paint-brush', mkname:'Appearance '}, 
          {faname: 'Plus', icon: 'plus', code: 'plus', mkname:'Add'},
          {faname: 'PlusSquare ', icon: 'plus-square', code: 'plus-square', mkname:'Add - Square'},
          {faname: 'QuestionCircle ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'Search ', icon: 'search', code: 'search', mkname:'Search'},
          {faname: 'SignInAlt ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'SignOutAlt ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'Sitemap ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'SlidersH ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'Spinner ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'Tag', icon: 'tag', code: 'tag', mkname:'Tag'},
          {faname: 'Tags', icon: 'tags', code: 'tags', mkname:'Tags'},
          {faname: 'Th ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'ThList ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'ThLarge', icon: ' ', code: ' ', mkname:' '},
          {faname: 'Times ', icon: 'times', code: 'times', mkname:'Close'},
          {faname: 'TrashAlt ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'User ', icon: 'user', code: 'user', mkname:'User'},
          {faname: 'UserCircle ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'UserCheck ', icon: 'user-check', code: 'user-check', mkname:'Select People'},
          {faname: 'UserEdit ', icon: ' ', code: ' ', mkname:' '},
          {faname: 'UserPlus ', icon: 'user-plus', code: 'user-plus', mkname:'Add People '},
          {faname: 'Users ', icon: 'users', code: 'users', mkname:'People/Groups'},
          {faname: 'Video', icon: 'video', code: 'video', mkname:'Item: Video'},
          {faname: 'Volume Up', icon: 'volume-up', code: 'volume-up', mkname:'Item: Audio'},
          {faname: 'WindowClose ', icon: 'window-close', code: 'window-close ', mkname:'Remove'}
        ],
        filter: null,

      }
    }
  }
</script>

<style lang="css">
</style>
