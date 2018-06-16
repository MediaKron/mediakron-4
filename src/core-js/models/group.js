
/**
 * The User Group Model
 */
module.exports = Mediakron.Extensions.Model.extend({
    id: 0,
    name: '',
    role: 'guest',
    urlRoot: (Mediakron.Data.models.group) ? Mediakron.Data.models.group : '',

    roleSelect: function (role) {
        if (this.get('role') == role) {
            return 'selected';
        }
        return '';
    },

    defaults: function () {
        return {
            id: 0,
            name: '',
            role: 'guest',
        };
    }
});