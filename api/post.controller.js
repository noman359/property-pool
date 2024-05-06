import TokenHandler from "../handlers/token.handler.js"
import PostService from "../services/post.service.js"
import config from '../config/index.js'

let postService = new PostService()
let tokenHandler = new TokenHandler()

export default class PostController {

    constructor() { }

    async createPost(req, res, next) {
        let created_post = await postService.createPost(req)
        next(created_post)
    }

    async updatePost(req, res, next) {
        let updated_post = await postService.updatePosts(req)
        next(updated_post)
    }

    async getPost(req, res, next) {
        let customer = await postService.getPost(req)
        next(customer)
    }

    async getPostList(req, res, next) {
        let customer = await postService.getPosts(req)
        next(customer)
    }

    async getMyPosts(req, res, next) {
        let customer = await postService.getMyPosts(req)
        next(customer)
    }

    async deletePost(req, res, next) {
        let customer = await postService.deletePost(req)
        next(customer)
    }

}