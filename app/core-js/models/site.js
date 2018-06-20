import Model from "~/core-js/extensions/models";
class Site extends Model {
  constructor() {
    super({
      id: 0,
      name: "",
      role: "guest",
      urlRoot: Mediakron.Data.models.group ? Mediakron.Data.models.group : ""
    });
  }
}
export default Site;