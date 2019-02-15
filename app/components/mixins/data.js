import recursiveClone from '@/store/utils/clone';
export const formDataMixin = {
  data() {
    return {
      localData: {},
    };
  },
  computed: {
    // ...mapState('locations', {
    //   sourceData: 'editableLocation'
    // }),
    isFormLoaded() {
      return this.localData? true : false;
    },
    storeData() {
      return recursiveClone(this.sourceData);
    },
  },
  watch: {
    storeData(value) {
      this.localData = value;
    },
  },
  created() {
    console.log(this.sourceData.banner_color);
    this.localData = recursiveClone(this.sourceData);
  },
};

export default formDataMixin;