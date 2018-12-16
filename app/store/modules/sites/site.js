import Model from "@/store/utils/model";

class Site extends Model {
  constructor(data) {
      super(data)
  }

  getLink(){
    return 'https://' + this.uri
  }
  
}
export default Site;