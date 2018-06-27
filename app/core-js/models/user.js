
// User Class
import Model from "~/core-js/extensions/models";
import { base_path, uri } from "../util/url";
class User extends Model {
  constructor() {
    super({
      id: 0,
      email: "",
      name: "Guest",
      role: "guest",
      bc: false,
      canvas: false,
      compare: {},
      history: {} 
    });
    this.urlRoot = function () {
      return base_path() + '/api/' + uri() + '/user';
    }
  }

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

  guest() {
    this.set("id", 0);
    this.set("name", "Guest");
    this.set("role", "guest");
  }

  isGuest() {
    if (this.id === 0) {
      return true;
    }
    return false;
  }

  isMember() {
    if (this.get("role") == "member") {
      return true;
    }
    return false;
  }

  roleSelect(role) {
    if (this.get("role") == role) {
      return "selected";
    }
    return "";
  }

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

  newContent() {}

  changedContent() {}

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