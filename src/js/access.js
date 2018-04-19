/**
 * This file defines the client side access control.
 * Remember, this is client side code.  Any user can bypass these checks, with just a bit of skill.  
 * all real access control should be defined by your server side access checks.  If you don't want a user to edit
 * data, or access a particular model, check access on the server side, and disallow access using
 * the server
 */

module.exports = {
    check:    function(permission, throwError){
        var role = Mediakron.user.get('role'), 
            permissions = this.roles[role].permissions,
            check = permissions[permission];
        if(permission == 'can connect site to canvas'){
            // right now, only bc users can use canvas!
            // this may change.  when it does, remove this!
            if(!Mediakron.user.get('bc')){
                check = false;
            }
        }
        if(!check && throwError){ this.denied(); }
        return permissions[permission];
    },
    denied: function(message){
        if(!message) message = 'Sorry, you are not allowed to access that page.  You may need to <a href="'+basepath+'login">login</a>.  Please contact your instructor, or Mediakron Support if you need access to that resource.';
        Mediakron.message({
            timeout: 0,
            type: 'warning',
            layout: 'center',
            text: message,
            dismiss:true
        });
    },
    isGuest: function(){
        if(!Mediakron.user) return true;
        return Mediakron.user.isGuest();
    },
    roles: {
        'guest': { 
            id:             'guest',
            name:           'Guest',
            description:    'Site Visitor.  On private sites, this user will have access only to the login route.  On public sites, this user will be able to view published content, and compare objects, but not comment or edit content.',
            permissions:    {
                'can access site':             false,
                'can download':                false,
                'can comment':                 false,
                'can import':                  false,
                'can export':                  false,
                'can edit own content':        false,
                'can add to any collection':   false,
                'can remove from any collection':   false,
                'can edit any content':        false,
                'can create content':          false,
                'can publish content':         false,
                'can archive content':         false,
                'can unpublish content':       false,
                'can view unpublished content':false,
                'can delete content':          false,
                'can save comparison':         false,
                'can access statistics':       false,
                'can change site settings':    false,
                'can connect site to canvas':  false,
                'can administer site':         false,
            }
        },
        'member': { 
            id:             'member',
            name:           'Member',
            description:    'Members are the normal user.  The can access all published content, and comment on content.',
            permissions:    {
                'can access site':             true,
                'can download':                true,
                'can comment':                 true,
                'can import':                  false,
                'can export':                  false,
                'can edit own content':        false,
                'can add to any collection':   false,
                'can remove from any collection':   false,
                'can edit any content':        false,
                'can create content':          false,
                'can publish content':         false,
                'can archive content':         false,
                'can unpublish content':       false,
                'can view unpublished content':false,
                'can delete content':          false,
                'can access statistics':       false,
                'can change site settings':    false,
                'can connect site to canvas':  false,
                'can administer site':         false
            }
        },
        'contributor': { 
            id:             'contributor',
            name:           'Contributor',
            description:    'Contributors are users that can add content, and edit their own content.  They cannot edit content created by other users, delete content or change site settings.  They also do not have access to unpublished content',
            permissions:    {
                'can access site':             true,
                'can download':                true,
                'can comment':                 true,
                'can import':                  false,
                'can export':                  false,
                'can edit own content':        true,
                'can add to any collection':   true,
                'can remove from any collection':   false,
                'can edit any content':        false,
                'can create content':          true,
                'can publish content':         true,
                'can archive content':         false,
                'can unpublish content':       true,
                'can view own unpublished content':true,
                'can view unpublished content':false,
                'can delete content':          true,
                'can save comparison':         true,
                'can access statistics':       false,
                'can change site settings':    false,
                'can connect site to canvas':  false,
                'can restore from trash':      true,
                'can administer site':         false
            }
        },
        'collaborator': { 
            id:             'collaborator',
            name:           'Collaborator',
            description:    'Collaborator are users that can add content, and edit their own content.  They cannot edit content created by other users, delete content or change site settings.  They also do not have access to unpublished content',
            permissions:    {
                'can access site':             true,
                'can download':                true,
                'can comment':                 true,
                'can import':                  false,
                'can export':                  false,
                'can edit own content':        true,
                'can add to any collection':   true,
                'can remove from any collection':   true,
                'can edit any content':        false,
                'can create content':          true,
                'can archive content':         false,
                'can publish content':         true,
                'can view own unpublished content': true,
                'can view unpublished content':     false,
                'can unpublish content':       true,
                'can delete content':          true,
                'can save comparison':         true,
                'can access statistics':       false,
                'can change site settings':    false,
                'can connect site to canvas':  false,
                'can restore from trash':      true,
                'can administer site':         false
            }
        },
        'editor': { 
            id:             'editor',
            name:           'Editor',
            description:    'Editors can edit any site content, publish and unpublish content.  They cannot delete content or change site settings',
            permissions:    {
                'can access site':             true,
                'can download':                true,
                'can comment':                 true,
                'can import':                  true,
                'can export':                  true,
                'can edit own content':        true,
                'can add to any collection':   true,
                'can remove from any collection':   true,
                'can edit any content':        true,
                'can create content':          true,
                'can archive content':         true,
                'can publish content':         true,
                'can view unpublished content':true,
                'can unpublish content':       true,
                'can delete content':          true,
                'can access statistics':       false,
                'can change site settings':    false,
                'can connect site to canvas':  false,
                'can restore from trash':      true,
                'can administer site':         false
            }
        },
        'administrator': { 
            id:             'administrator',
            name:             'Administrator',
            description:    'Administrators can do just about anything they want on the site.  They don\'t have access to the true backend, since this is a client side check, but otherwise their access check is always true',
            permissions:    {
                'can access site':             true,
                'can download':                true,
                'can comment':                 true,
                'can import':                  true,
                'can export':                  true,
                'can edit own content':        true,
                'can add to any collection':   true,
                'can remove from any collection':   true,
                'can edit any content':        true,
                'can create content':          true,
                'can publish content':         true,
                'can archive content':         true,
                'can unpublish content':       true,
                'can view unpublished content':true,
                'can delete content':          true,
                'can save comparison':         true,
                'can access statistics':       true,
                'can change site settings':    true,
                'can connect site to canvas':  true,
                'can administer site':         true,
                'can restore from trash':      true,
                'can edit any locked content':      true
            }
        }
    }
};

