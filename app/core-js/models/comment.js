/**
 * Create Comment Model
 */
module.exports = Mediakron.Extensions.Model.extend({
        initialize: function (data) {
            this.uri = data.uri;
        },
        id: 0,
        start: 0,
        end: 0,
        user: false,
        snippet: '',
        comment: '',
        created: 0,
        changed: 0,
        private: 'public',
        uri: '',
        urlRoot: function () {
            return Mediakron.Data.models.comments + '/' + this.get('uri');
        },
        defaults: function () {
            return {
                start: 0,
                end: 0,
                user: false,
                archive: false,
                snippet: '',
                comment: '',
                private: 'public',
                created: 0,
                changed: 0,
            };
        },
        getUsername: function () {
            var userid = this.get('user_id');
            var user = Mediakron.users.get(userid);
            if (user) {
                return user.get('name');
            }
            return 'Guest';
        },

        archived: function () {
            if (this.get('archive')) {
                return true;
            }
            return false;
        },
        privateInt: function () {
            if (!isNaN(this.get('private'))) {
                return this.get('private');
            }
            switch (this.get('private')) {
                case 'public':
                    return 0;
                case 'private':
                    return 1;
                case 'personal':
                    return 2;
            }
            return 0;

        },
        story: function () {
            return Mediakron.getItemFromURI(this.get('uri'));
        },
        canAccess: function () {
            var uid = this.get('user_id');
            var user = false;
            if (Mediakron.user) {
                user = Mediakron.user.get('id');
            }
            var story = this.story();
            if (this.archived()) {
                if (uid == user || Mediakron.Access.check('can administer site')) {
                    return true;
                } else {
                    return false;
                }
            }
            if (this.privateInt() === 0) {
                return true;
            } else if (this.privateInt() == 1 && (uid == user || user == story.get('user').id) || Mediakron.Access.check('can administer site')) {
                return true;
            } else if (this.privateInt() == 2 && uid == user) {
                return true;
            }
            return false;
        },
        canEdit: function () {
            var uid = this.get('user_id');
            var user = false;
            if (Mediakron.user) {
                user = Mediakron.user.get('id');
            }
            var story = this.story();
            if (uid == user) {
                return true;
            }
            return false;
        },
        canDelete: function () {
            var uid = this.get('user_id');
            var user = false;
            if (Mediakron.user) {
                user = Mediakron.user.get('id');
            }
            var story = this.story();
            if (this.privateInt() === 0) {
                return true;
            } else if (this.privateInt() == 1 || uid == user || uid == story.get('user').id) {
                return true;
            } else if (this.privateInt() == 2 || uid == user) {
                return true;
            }
            return false;
        }
    });