import Model from "~/core-js/extensions/models";
import { base_path, uri } from "../util/url"

class Site extends Model {
  constructor() {
      super()
      this.id = 0;
      this.urlRoot = function(){
          return base_path() + '/api/' + uri()
      }
  }

  populateSettings(){

  }
}
export default Site;