import { createMiddleware } from 'vue-router-middleware';
 
// Pass middleware name and callback function
createMiddleware('log', (args, to, from, next) => {
    // ok, all is fine. go to next route
    console.log(to)
    next()
})