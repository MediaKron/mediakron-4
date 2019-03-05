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
        console.log('edit clicked')
        this.setEditItem(this.item);
        this.editAlert = this.dismissSecs 
    },
    // Save only if isEditing switched back to false
    saveClicked() {
        this.saveItem()
        this.saveAlert = this.dismissSecs
    },
  },
  watch: {
  },
  created() {
//    this.localData = recursiveClone(this.sourceData);
  },
};

export default editable;