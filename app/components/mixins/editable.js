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
        if (this.isEditing) return 'Save'
        return 'Edit'
    },
  },
  methods:{
    ...mapActions("items", [
        "update",
        "saveItem",
        "setEditItem"
    ]),
    editClicked() {
        this.editAlert = this.dismissSecs 
        
        // Save only if isEditing switched back to false
        if (!this.isEditing) {
            this.saveItem()
            this.saveAlert = this.dismissSecs
        }
    },
  },
  watch: {
  },
  created() {
//    this.localData = recursiveClone(this.sourceData);
  },
};

export default editable;