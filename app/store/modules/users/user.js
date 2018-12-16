
import Model from "@/store/utils/model";

class User extends Model {
  constructor(data) {
      super(data)
  }

  /**
   * Get a link
   * TODO: Can this be removed
   */
  getLink(){
    return 'https://' + this.uri
  }

  /**
   * Set the defaults for the user
   * TODO: Expand this function to fully describe a basic user
   * TODO: Maybe set type rules?
   */
  defaults() {
    return {
      id: 0,
      email: "",
      name: "guest",
      role: "guest",
      bc: false,
      canvas: false
    };
  }

  /**
   * Set the rules for a guest user
   * TODO: This probably needs to get moved 
   * into a static function that spins out a new
   * object when called
   */
  static guest() {
    return new User({
      id: 0,
      email: "",
      name: "guest",
      role: "guest",
      bc: false,
      canvas: false
    });
  }


  /**
   * Is the user a guest (eg. not authenticated)
   */
  isGuest() {
    if (this.id === 0) {
      return true;
    }
    return false;
  }

  /**
   * Is the user a member of the current site
   */
  isMember() {
    if (this.get("role") == "member") {
      return true;
    }
    return false;
  }

  /**
   * Return Selected if the user has a particular role
   * @param {String} role 
   */
  roleSelect(role) {
    if (this.get("role") == role) {
      return "selected";
    }
    return "";
  }

  /**
   * When did the user last visit this site
   */
  lastVisit() {
    var localStorage = window.localStorage;
    var key = Mediakron.Settings.uri + "_lastvisit";
    var visit = this.get("visit");
    if (visit) visit = parseInt(visit, 10);
    var now = Math.floor(+new Date() / 1000);
    var item = localStorage.getItem(key);
    if (item) {
      item = JSON.parse(item);
      if (item.last < now) {
        item.last = now + 3600;
        item.visit = visit;
      } else {
        return item.visit;
      }
    } else {
      item = {
        last: now + 3600,
        visit: visit
      };
    }
    item = JSON.stringify(item);
    localStorage.setItem(key, item);
    return visit;
  }

  /**
   * Get a list of content for this user since 
   * last login
   * TODO: Still needed?
   */
  newContent() {}

  /**
   * Get a list of changed content since last login
   * TODO: Remove
   */
  changedContent() {}

  /**
   * Is the user an admin
   * TODO: change so its sensitive to to the current site
   */
  isAdmin(){
    if (this.get('role') == 'manager' || this.get('role') == 'instructor' || this.get('role') == 'administrator' || this.get('role') == 'ia') {
      return true;
    }
    return false;
  }

  /**
   * Can the user edit this item
   * TODO:
   * @param {} type 
   * @param {*} item 
   */
  canEditItem(type, item) {
    if (Mediakron.Settings.editEnabled) {
      var canedit = this.get("canedit"),
        administrator = this.get("administrator"),
        id = this.get("id");
      if (administrator === true) {
        Mediakron.Edit.setCanEditStatus(true);
        return true;
      }

      if (canedit === true && type == "topic") {
        Mediakron.Settings.setCanEditStatus(true);
        return true;
      }
      var author = item.get("author");
      if (canedit === true && type == "item" && author == id) {
        Mediakron.Edit.setCanEditStatus(true);
        return true;
      }
      Mediakron.Edit.setCanEditStatus(false);
      return false;
    }
    Mediakron.Edit.setCanEditStatus(false);
    return false;
  }
}

export default User;