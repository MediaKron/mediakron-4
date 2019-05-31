import recursiveClone from '@/store/utils/clone';
import { mapGetters, mapActions } from 'vuex'
export const editable = {
  data() {
    return {
        dismissSecs: 4,
        editAlert: 0,
        saveAlert: 0,
    };
  },
  computed: {
    getEditPrompt() {
        console.log(this.isEditing);
        if (this.isEditing) return 'Save'
        return 'Edit'
    },
    ...mapGetters("items", [
        "isEditing"
    ]),
  },
  methods:{
    ...mapActions("items", [
        "update",
        "saveItem",
        "setEditItem"
    ]),
    editClicked() {
        this.setEditItem(this.item);
        this.editAlert = this.dismissSecs 
        // this.$bvToast.show('editing-message')
        this.$bvToast.toast(`You are now in editing mode`, {
          toaster: "b-toaster-top-center",
          variant: "warning",
          solid: true,
          autoHideDelay: 2500,
          noCloseButton: true,
          bodyClass: "text-center"
        }) 
    },
    // Save only if isEditing switched back to false
    saveClicked() {
        this.saveItem()
        this.saveAlert = this.dismissSecs
        // this.$bvToast.show('save-message')
        this.$bvToast.toast(`Changes Saved`, {
          toaster: "b-toaster-top-center",
          variant: "success",
          solid: true,
          autoHideDelay: 2500,
          noCloseButton: true,
          bodyClass: "text-center"
        }) 
    },
    cancelClicked() {
        this.setEditItem = '';
        isEditing = false;
        console.log("canceled")
    }
  },
  watch: {
  },
  created() {
//    this.localData = recursiveClone(this.sourceData);
  },
};

export default editable;