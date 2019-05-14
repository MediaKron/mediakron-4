
import Model from "@/store/utils/model";

class Event extends Model {
  constructor(data) {
      super(data)
  }

  /**
   * Set the defaults for the event
   */
  defaults() {
    return {
      id: Math.random().toString(36).substr(2),
      message: '',
      type: 'info',
      dismissable: false,
      expires: 15
    };
  }

}

export default Event;