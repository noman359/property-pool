import handler from '../handlers/index.js'
import config from '../config/index.js'
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;
import TokenHandler from "../handlers/token.handler.js"
import { v4 as uuidv4 } from 'uuid';

let db = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })
let bucket = new handler.bucketHandler()
let encryption = new handler.encryption()
let commons = new handler.commonsHandler()
let JWT = new handler.JWT()

let tokenHandler = new TokenHandler()

export default class CustomerService {

    constructor() { }


    async createCustomer(customerBody) {
        let servResp = new config.serviceResponse()
        let customer_avatar = new Object()
        try {
            console.debug('createCustomer() started')


            if (customerBody.email != null) {
                let customer = await db.users.findFirst({
                    where: {
                        email: customerBody.email
                    }
                })
                if (customer != null) {
                    servResp.data = null
                    servResp.message = 'User already exist'
                    servResp.isError = true
                    return servResp
                }

            }

            const encrptedPassword = encryption.encrypt(customerBody.password)
            await db.users.create({
                data: {
                    email: customerBody.email,
                    first_name: customerBody.first_name,
                    last_name: customerBody.last_name,
                    password: encrptedPassword,
                    created_at: new Date(new Date().toUTCString()),
                }
            })

            let newCustomer = await db.users.findFirst({
                where: {
                    email: customerBody.email
                }
            })

            if (!newCustomer) {
                throw new Error('User not found, Incorrect email or password')
            }

            let token = await JWT.getToken(newCustomer)
            servResp.data = {
                ...newCustomer, token: token
            }
            console.debug('createCustomer() returning')

        } catch (error) {
            console.debug('createVendor() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }

    async updateCustomer(req) {
        let servResp = new config.serviceResponse()
        let customer_avatar = new Object()
        let customerBody = req.body
        try {

            let token = await tokenHandler.checkToken(req)
            if (token.isError == true) {
                servResp.isError = true
                servResp.message = 'Token is not valid'
                return servResp
            }


            console.debug('update Customer() started')
            let customer = await db.users.findFirst({ where: { id: token.id } })

            if (!customer) {
                throw new Error('Customer not found!')
            }

            // if (customerBody.avatar) {
            //     if (typeof customerBody.avatar === 'string') {
            //         customer_avatar['url'] = customerBody.avatar
            //     } else {
            //         var arr = customerBody.avatar.name.split('.')
            //         let extentionName = arr[arr.length - 1]
            //         let avatar_val = {
            //             bucket: config.london_gates_s3_bucket_name,
            //             key: `${uuidv4()}.${extentionName}`,
            //             body: await bucket.fileToArrayBuffer(customerBody.avatar)
            //         }
            //         customer_avatar = await bucket.upload(avatar_val)
            //     }
            // }

            var first_name = customer.first_name
            if (customerBody.first_name) {
                first_name = customerBody.first_name
            }

            var last_name = customer.last_name
            if (customerBody.last_name) {
                last_name = customerBody.last_name
            }

            // customerBody.password = encryption.encrypt(customerBody.password)
            console.log(newImage)
            let updatedCustomer = await db.users.update({
                data: {
                    first_name: first_name || undefined,
                    last_name: last_name || undefined,
                    updated_at: new Date(new Date().toUTCString())
                },
                where: {
                    id: Number(token.id)
                }
            })
            console.debug('createCustomer() returning')
            servResp.data = updatedCustomer
        } catch (error) {
            console.debug('createCustomer() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }

    async changePassword(req) {
        let servResp = new config.serviceResponse()
        let customer_avatar = new Object()
        let customerBody = req.body
        try {

            let token = await tokenHandler.checkToken(req)
            if (token.isError == true) {
                servResp.isError = true
                servResp.message = 'Token is not valid'
                return servResp
            }


            console.debug('update Customer() started')
            let customer = await db.users.findFirst({ where: { id: token.id } })

            if (!customer) {
                throw new Error('Customer not found!')
            }

            var password = customer.password
            const oldPassword = encryption.encrypt(customerBody.oldPassword)
            if (password === oldPassword) {

                const newPassword = encryption.encrypt(customerBody.newPassword)
                let updatedCustomer = await db.users.update({
                    data: {
                        password: newPassword || undefined,
                        updated_at: new Date(new Date().toUTCString())
                    },
                    where: {
                        id: Number(token.id)
                    }
                })
                console.debug('createCustomer() returning')
                servResp.data = updatedCustomer

            } else {
                throw new Error('Your old password is not correct!')
            }
           
        } catch (error) {
            console.debug('createCustomer() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }

    async saveCustomerFCMToken(query) {
        let servResp = new config.serviceResponse()
        try {
            let token = await tokenHandler.checkToken(req)
            if (token.isError == true) {
                servResp.isError = true
                servResp.message = 'Token is not valid'
                return servResp
            }
            console.debug('getVendorData() started')
            let customer = await db.users.update({
                where: {
                    id: Number(token.id)
                },
                data: {
                    fcm_token: query.token
                }
            })

            servResp.data = customer
            console.debug('getVendorData() ended')
        } catch (error) {
            console.debug('createVendor() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }

    async getCustomer(req) {
        let servResp = new config.serviceResponse()
        try {
            let token = await tokenHandler.checkToken(req)
            if (token.isError == true) {
                servResp.isError = true
                servResp.message = 'Token is not valid'
                return servResp
            }
            console.debug('getCustomer() started')
            servResp.data = await db.users.findFirst({
                where: {
                    id: Number(token.id)
                },
                include: {
                    cities: true
                }
            })
            console.debug('getCustomer() returning')
        } catch (error) {
            console.debug('getCustomer() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }

    async deleteCustomer(req) {
        let servResp = new config.serviceResponse()
        try {
            let token = await tokenHandler.checkToken(req)
            if (token.isError == true) {
                servResp.isError = true
                servResp.message = 'Token is not valid'
                return servResp
            }
            console.debug('getCustomer() started')
            servResp.data = await db.users.deleteMany({
                where: {
                    id: Number(token.id)
                }
            })
            console.debug('getCustomer() returning')
        } catch (error) {
            console.debug('getCustomer() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }

    async signIn(query) {
        let servResp = new config.serviceResponse()
        try {
            console.debug('customer signIn() started')
            let encrypted_password = encryption.encrypt(query.password)
            let customer = await db.users.findFirst({
                where: {
                    email: query.email,
                    password: encrypted_password
                }
            })

            if (!customer) {
                throw new Error('User not found, Incorrect email or password')
            }

            let token = await JWT.getToken(customer)
            servResp.data = {
                ...customer, token: token
            }

            console.debug('customer signIn() ended')
        } catch (error) {
            console.debug('customer signIn() exception thrown')
            servResp.isError = true
            servResp.message = error.message
        }
        return servResp
    }



}