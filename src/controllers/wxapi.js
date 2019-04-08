import models from '../models/index'
import { res, isEmptyArr, createRandomId } from '../tool/Common'
import request from '../tool/request'
import { signToken } from './auth'
import fs from 'fs'
import path from 'path'
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
  if(login.errcode == 40163) {
    let error = {
      msg: 'code已被使用，请重新登录！',
      code: 40163
    }
    throw error
  }
  console.log(login)
  let session_key = login.session_key,
    openid = login.openid
  //用openId登录并返回用户信息
  let userInfo = await wxLogin(openid, session_key, encryptedData, signature, iv)

  let result = {
    userId: userInfo.userId,
    nickName: userInfo.nickName,
    gender: userInfo.gender,
    city: userInfo.city,
    province: userInfo.province,
    country: userInfo.country,
    avatarUrl: userInfo.avatarUrl,
    token: userInfo.token
  }
  ctx.body = res(result, 'success')
}

export let wxLogout = async (ctx) => { 
  let result = await models.user.userDB.update({ token: null }, { where: { userId: ctx.state.userId } })
  console.log(result)
  ctx.body = res('退出成功', 'success')
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
  let userId = 'wx_' + createRandomId()
  let token = signToken({ userInfo: { userId: userId } })
  let user = await models.user.userDB.create({ userId, openid, session_key, nickName: userInfo.nickName, gender: userInfo.gender, language: userInfo.language, city: userInfo.city, province: userInfo.province, country: userInfo.country, avatarUrl: userInfo.avatarUrl, token })
  return user
}

//用openid登录并获取userInfo
async function wxLogin(openid, session_key, encryptedData, signature, iv, token) {
  //解密用户信息
  let pc = new WXBizDataCrypt(ppsmWxappAppId, session_key)
  let userInfo = await pc.decryptData(encryptedData, iv)
  //通过openid查询是否存在该用户
  let user = await models.user.userDB.findAll({ where: { openid } })
  //不存在的话用openid为唯一key新建用户
  if (isEmptyArr(user)) {
    //创建并返回用户信息
    userInfo = await createWxappUser(openid, session_key, userInfo)
    return userInfo
  } else {
    let token = signToken({ userInfo: { userId: user[0].userId } })
      await models.user.userDB.update({ token }, { where: { userId: user[0].userId } })
      user[0].token = token
      return user[0]
  }
}
