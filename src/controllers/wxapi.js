import {res} from '../tool/Common'
import request from '../tool/request'
import fs from 'fs'
import path from 'path'
const secretPath = process.env.NODE_ENV=='production'?path.resolve():path.resolve('./AppSercet.key')
const ppsmWxappAppId = 'wx98da8b39cfd981ed'
const CODE2SESSION = 'https://api.weixin.qq.com/sns/jscode2session'
export let code2Session = async (ctx) => {
 let body = ctx.request.body,
 appid = ppsmWxappAppId,
 secret = fs.readFileSync(secretPath, 'utf8'),
 js_code = body.js_code

 let result = await request({
     url: CODE2SESSION,
     method: 'GET',
     data: {appid,secret,js_code,grant_type:'uthorization_code'}
 })
 ctx.body = res(result,'success')
}