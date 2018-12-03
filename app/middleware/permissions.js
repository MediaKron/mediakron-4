import { createMiddleware } from 'vue-router-middleware';
 
const Permissions = {
    canAccess() {
        return true
    }
}

// Pass middleware name and callback function
createMiddleware('check-permissions', (args, to, from, next) => {

    if(Permissions.canAccess())
        // ok, all is fine. go to next route
        next()
    else
        // hum... not's fine, cancel the middleware
        next(false)

})