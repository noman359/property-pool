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
        let post = await postService.getPost(req)
        next(post)
    }

    async getPostList(req, res, next) {
        let posts = await postService.getPosts(req)
        next(posts)
    }

    async getMyPosts(req, res, next) {
        let posts = await postService.getMyPosts(req)
        next(posts)
    }

    async deletePost(req, res, next) {
        let post = await postService.deletePost(req)
        next(post)
    }

    async likePost(req, res, next) {
        let post = await postService.likePost(req)
        next(post)
    }

    async unlikePost(req, res, next) {
        let post = await postService.unlikePost(req)
        next(post)
    }

    async favoritePost(req, res, next) {
        let post = await postService.favoritePost(req)
        next(post)
    }

    async unfavoritePost(req, res, next) {
        let post = await postService.unfavoritePost(req)
        next(post)
    }

    async favoriteList(req, res, next) {
        let post = await postService.getFavorites(req)
        next(post)
    }

}