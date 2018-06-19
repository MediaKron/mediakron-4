
import Model from "~/core-js/extensions/models";
class Group extends Model {
    constructor() {
        super({
            id: 0,
            name: '',
            role: 'guest',
            urlRoot: (Mediakron.Data.models.group) ? Mediakron.Data.models.group : '',
        })
    }

    roleSelect(role) {
        if (this.get('role') == role) {
            return 'selected';
        }
        return '';
    }

    defaults(){
        return {
            id: 0,
            name: '',
            role: 'guest',
        };
    }
}
export default Group;