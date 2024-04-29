import { Router } from "express"
import handler from '../handlers/index.js'
import customerRouter from "./customer.router.js"


export default () => {
    let router = Router()
    customerRouter(router)
    router.use(handler.apiResponseHandler)
    return router
}