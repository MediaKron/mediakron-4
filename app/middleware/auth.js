import { createMiddleware } from 'vue-router-middleware';
 
const FakeAuth = {
    isAuthenticated() {
        return true
    }
}

// Pass middleware name and callback function
createMiddleware('require-auth', (args, to, from, next) => {

    if(FakeAuth.isAuthenticated())
        // ok, all is fine. go to next route
        next()
    else
        // cancel the middleware
        next(false)

})