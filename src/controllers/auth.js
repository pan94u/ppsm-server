import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import models from '../models/index'
const unless = require('koa-unless');
const publicKey = fs.readFileSync(path.join(__dirname, '../../publicKey.pub'))

// 用户登录的时候返回token
// let token = jwt.sign({
//   userInfo: userInfo // 你要保存到token的数据
// }, publicKey, { expiresIn: '7d' })

/**
 * 检查授权是否合法
 */
export let CheckAuth = () => {
  const middleware = async (ctx, next) => {
    try {
      let token = ctx.request.header.authorization
      let decoded = jwt.verify(token, publicKey),
        userId = decoded.userInfo.userId

      // 检验token有效性
      if (!decoded.userInfo) {
        ctx.status = 403
        ctx.body = {
          code: -1002,
          data: null,
          msg: '登录信息错误，请重新登录'
        }
        return
      }

      let userInfo
      //通过路径识别不同token
      if(ctx.request.path.match(/^\/admin/)) {
        userInfo = await models.adminUser.userDB.findAll({ where: { userId } })
      }
      else {
        userInfo = await models.user.userDB.findAll({ where: { userId } })
      }
      // 检查token是否过期

      if (userInfo.length === 0) {
        ctx.status = 403
        ctx.body = {
          code: -1000,
          data: null,
          msg: '用户不存在，请重试'
        }
        return
      }
      if (userInfo[0].token != token) {
        ctx.status = 401
        ctx.body = {
          code: -1001,
          data: null,
          msg: '登录信息失效，请重新登录'
        }
        return
      }

      // 通过将用户名写入ctx并next
      ctx.state.userId = userId
      return next()
    } catch (err) {
      ctx.status = 403
      ctx.body = {
        code: -1004,
        data: null,
        msg: '登录信息错误，请重新登录'
      }
    }
  }
  middleware.unless = unless;
  return middleware
}

//验证token
export let checkToken = (token) => {
  try {
    let decoded = jwt.verify(token, publicKey)
    if (decoded.userInfo) {
      return true
    } else {
      return false
    }
  } catch (err) {
    return false
  }
}

//签发token
export let signToken = (params) => {
  return jwt.sign(params, publicKey, { expiresIn: '7d' })
}


export let Post = (ctx) => {
  switch (ctx.params.action) {
    case 'check':
      ctx.body = CheckAuth(ctx)
    default:
      ctx.body = CheckAuth(ctx)
  }
}
