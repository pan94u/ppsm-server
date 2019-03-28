import models from '../models/index'
import { res, isEmptyArr } from '../tool/Common'
import request from '../tool/request'
import { signToken } from '../tool/token'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
//公钥
const publicKey = fs.readFileSync(path.join(__dirname, '../../publicKey.pub'))
//微信小程序解密模块
const WXBizDataCrypt = require('../tool/WXBizDataCrypt')
const secretPath = process.env.NODE_ENV == 'production' ? path.resolve() : path.resolve('./AppSercet.key')
const ppsmWxappAppId = 'wx98da8b39cfd981ed'
const CODE2SESSION = 'https://api.weixin.qq.com/sns/jscode2session'
export let code2Session = async (ctx) => {
  let body = ctx.request.body,
    appid = ppsmWxappAppId,
    secret = fs.readFileSync(secretPath, 'utf8'),
    js_code = body.code,
    encryptedData = body.encrypted_data,
    signature = body.signature,
    iv = body.iv
  //微信登录，拿openid和session_key
  let login = await request({
    url: CODE2SESSION,
    method: 'GET',
    params: { appid, secret, js_code, grant_type: 'authorization_code' }
  })
  let session_key = login.session_key,
    openid = login.openid
  //用openId登录并返回用户信息
  let userInfo = await wxLogin(openid, session_key, encryptedData, signature, iv)
  let token = signToken({ userInfo: { userId: userInfo.userId } })
  userInfo = {
    userId: userInfo.userId,
    nickName: userInfo.nickName,
    gender: userInfo.gender,
    city: userInfo.city,
    province: userInfo.province,
    country: userInfo.country,
    avatarUrl: userInfo.avatarUrl,
    token
  }
  ctx.body = res(userInfo, 'success')
}

//用openid创建user
async function createWxappUser(openid, session_key, userInfo) {
  if (!openid) {
    let error = {
      msg: '未找到openid，用户创建失败',
      code: -3
    }
    throw error
  }
  let userId = createRandomId()
  let user = await models.user.userDB.create({ userId, openid, session_key, nickName: userInfo.nickName, gender: userInfo.gender, language: userInfo.language, city: userInfo.city, province: userInfo.province, country: userInfo.country, avatarUrl: userInfo.avatarUrl })
  return user[0]
}

//用openid登录并获取userInfo
async function wxLogin(openid, session_key, encryptedData, signature, iv) {
  //解密用户信息
  let pc = new WXBizDataCrypt(ppsmWxappAppId, session_key)
  let userInfo = await pc.decryptData(encryptedData, iv)
  //通过openid查询是否存在该用户
  let user = await models.user.userDB.findAll({ where: { openid } })
  //不存在的话用openid为唯一key新建用户
  if (isEmptyArr(user)) {
    userInfo = await createWxappUser(openid, session_key, userInfo)
    //登录user
    return userInfo
  } else {
    //登录user
    return user[0]
  }
}

function createRandomId(length = 3) {
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
}