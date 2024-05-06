import { Router } from "express"
import handler from '../handlers/index.js'
import customerRouter from "./customer.router.js"
import postRouter from "./post.router.js"


export default () => {
    let router = Router()
    customerRouter(router)
    postRouter(router)
    router.use(handler.apiResponseHandler)
    return router
}