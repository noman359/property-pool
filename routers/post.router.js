import handler from '../handlers/index.js';
import { Router } from 'express';
import PostController from '../api/post.controller.js';
import formData from '../middlewares/formdata-parser.js';

const postControllerr = new PostController()
const lRoute = Router();
export default function (router) {
    router.use('/post', lRoute)
    // lRoute.post('/token', customerCtrl.getFCMToken, handler.apiResponseHandler)
     lRoute.post('/',formData, postControllerr.createPost, handler.apiResponseHandler)
     lRoute.get('/:id', postControllerr.getPost, handler.apiResponseHandler)
     lRoute.put('/:id', formData, postControllerr.updatePost, handler.apiResponseHandler)
     lRoute.delete('/:id', postControllerr.deletePost, handler.apiResponseHandler)
}