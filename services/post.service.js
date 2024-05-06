import handler from '../handlers/index.js'
import config from '../config/index.js'
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import TokenHandler from "../handlers/token.handler.js"
import { v4 as uuidv4 } from 'uuid';
import pkg from 'aws-sdk';
import bodyParser from 'body-parser';
let db = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
let bucket = new handler.bucketHandler()
let commons = new handler.commonsHandler()
let JWT = new handler.JWT()

let tokenHandler = new TokenHandler()

export default class PostService {

    constructor() { }


    async createPost(req) {
        let servResp = new config.serviceResponse()
        let body = req.body
        var postImages = ''
        try {

            let token = await tokenHandler.checkToken(req)
            if (token.isError == true) {
                servResp.isError = true
                servResp.message = 'Token is not valid'
                return servResp
            }

            var postDetail = {}
            if (body.description !== undefined) {
                postDetail.description = body.description
            }


            if (body.medias) {

                if (body.medias.length > 1) {
                    for (var item of body.medias) {
                        let post_item = new Object()
                        var arr = item.name.split('.')
                        let extentionName = arr[arr.length - 1]

                        let avatar_val = {
                            bucket: config.post_bucket_name,
                            key: `${uuidv4()}.${extentionName}`,
                            body: await bucket.fileToArrayBuffer(item)
                        }
                        post_item = await bucket.upload(avatar_val)
                        medias.push(post_item.url)
                    }

                    postImages = medias.join(',')
                    if (postImages != '') {
                        postDetail.images = postImages
                    }
                } else {
                    let post_item = new Object()
                    var arr = body.medias.name.split('.')
                    let extentionName = arr[arr.length - 1]

                    let avatar_val = {
                        bucket: config.pool_property_bucket_name,
                        key: `${uuidv4()}.${extentionName}`,
                        body: await bucket.fileToArrayBuffer(body.medias)
                    }
                    post_item = await bucket.upload(avatar_val)
    
                    if (post_item.url != '') {
                        postDetail.images = post_item.url
                    }
                }
            }


            let post = await db.posts.create({
                data: {
                    description: body.description,
                    media_urls: postDetail.images || undefined,
                    created_at: new Date(new Date().toUTCString()),
                    customer_id: token.id
                }
            })

            servResp.data = post

            console.debug('createCustomer() returning')

        } catch (error) {
            console.debug('createVendor() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }

    async updatePosts(req) {
        let servResp = new config.serviceResponse()
        let body = req.body
        var postImages = ''
        try {

            let token = await tokenHandler.checkToken(req)
            if (token.isError == true) {
                servResp.isError = true
                servResp.message = 'Token is not valid'
                return servResp
            }

            var postDetail = {}
            if (body.description !== undefined) {
                postDetail.description = body.description
            }

            if (body.medias) {

                if (body.medias.length > 1) {
                    for (var item of body.medias) {
                        let post_item = new Object()
                        var arr = item.name.split('.')
                        let extentionName = arr[arr.length - 1]

                        let avatar_val = {
                            bucket: config.post_bucket_name,
                            key: `${uuidv4()}.${extentionName}`,
                            body: await bucket.fileToArrayBuffer(item)
                        }
                        post_item = await bucket.upload(avatar_val)
                        medias.push(post_item.url)
                    }

                    postImages = medias.join(',')
                    if (postImages != '') {
                        postDetail.images = postImages
                    }
                } else {
                    let post_item = new Object()
                    var arr = body.medias.name.split('.')
                    let extentionName = arr[arr.length - 1]

                    let avatar_val = {
                        bucket: config.pool_property_bucket_name,
                        key: `${uuidv4()}.${extentionName}`,
                        body: await bucket.fileToArrayBuffer(body.medias)
                    }
                    post_item = await bucket.upload(avatar_val)
    
                    if (post_item.url != '') {
                        postDetail.images = post_item.url
                    }
                }
            }

            let post = await db.posts.update({
                data: {
                    description: postDetail.description,
                    media_urls: postDetail.images || undefined,
                    created_at: new Date(new Date().toUTCString())                
                },
                where: {
                    id: Number(req.params.id),
                    customer_id: Number(token.id)
                }
            })
            console.debug('updatePost() returning')
            servResp.data = post

        } catch (error) {
            console.debug('updatePost() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }

    async getPost(req) {
        let servResp = new config.serviceResponse()
        let id = req.params.id
        try {
            let token = await tokenHandler.checkToken(req)
            if (token.isError == true) {
                servResp.isError = true
                servResp.message = 'Token is not valid'
                return servResp
            }
            console.debug('getCustomer() started')
            servResp.data = await db.posts.findFirst({
                where: {
                    id: Number(id)
                }
            })
            console.debug('getPosts() returning')
        } catch (error) {
            console.debug('getPosts() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }

    async deletePost(req) {
        let servResp = new config.serviceResponse()
        let id = req.params.id
        try {
            let token = await tokenHandler.checkToken(req)
            if (token.isError == true) {
                servResp.isError = true
                servResp.message = 'Token is not valid'
                return servResp
            }
            console.debug('deletePost() started')
            servResp.data = await db.posts.delete({
                where: {
                    customer_id: Number(token.id),
                    id: Number(id)
                }
            })
            console.debug('deletePost() returning')
        } catch (error) {
            console.debug('deletePost() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }

    async getMyPosts(req) {
        let servResp = new config.serviceResponse()
        let query = req.query
        let token = await tokenHandler.checkToken(req)
        if (token.isError == true) {
            servResp.isError = true
            servResp.message = 'Token is not valid'
            return servResp
        }

        try {
            const posts = await db.posts.findMany({
                where: {
                    customer_id: Number(token.id)
                },
                skip: Number((query.page - 1)) * Number(query.limit), // Calculate the number of records to skip based on page number
                take: Number(query.limit), // Set the number of records to be returned per page

            });


            servResp.data = posts
            console.debug('getVendorData() ended')
        } catch (error) {
            console.debug('createVendor() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }

    async getPosts(req) {
        let servResp = new config.serviceResponse()
        let query = req.query
        let token = await tokenHandler.checkToken(req)
        if (token.isError == true) {
            servResp.isError = true
            servResp.message = 'Token is not valid'
            return servResp
        }

        try {
            const posts = await db.posts.findMany({
                skip: Number((query.page - 1)) * Number(query.limit), // Calculate the number of records to skip based on page number
                take: Number(query.limit), // Set the number of records to be returned per page

            });


            servResp.data = posts
            console.debug('getVendorData() ended')
        } catch (error) {
            console.debug('createVendor() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }

    async likePost(req) {
        let servResp = new config.serviceResponse()
        let id = req.params.id
        try {
            let token = await tokenHandler.checkToken(req)
            if (token.isError == true) {
                servResp.isError = true
                servResp.message = 'Token is not valid'
                return servResp
            }
            console.debug('deletePost() started')
            servResp.data = await db.likes.create({
                data: {
                    created_at: new Date(new Date().toUTCString()),
                    customer_id: Number(token.id),
                    post_id: Number(id),
                }
            })
            console.debug('deletePost() returning')
        } catch (error) {
            console.debug('deletePost() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }

    async unlikePost(req) {
        let servResp = new config.serviceResponse()
        let id = req.params.id
        try {
            let token = await tokenHandler.checkToken(req)
            if (token.isError == true) {
                servResp.isError = true
                servResp.message = 'Token is not valid'
                return servResp
            }
            console.debug('deletePost() started')
            servResp.data = await db.likes.delete({
                where: {
                    id: Number(id),
                    customer_id: Number(token.id)
                }
            })
            console.debug('deletePost() returning')
        } catch (error) {
            console.debug('deletePost() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }


}

