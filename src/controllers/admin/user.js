import models from '../../models/index'
import { res, isEmptyArr, createRandomId, notNull } from '../../tool/Common'
import { signToken } from '../auth'
const crypto = require('crypto')

// 后台登录
export let login = async (ctx) => {
  let body = ctx.request.body,
    md5 = crypto.createHash('md5'),
    userName = body.userName,
    passWord = md5.update(body.passWord).digest('hex')
  let result = await models.adminUser.userDB.findOne({
    where: {
      $or: [
        { userId: userName },
        { email: userName },
        { phone: userName }
      ],
      passWord
    },
    attributes: ['id', 'userId', 'token']
  })
  if (isEmptyArr(result)) {
    let error = {
      code: 1001,
      msg: '用户名或密码不匹配！'
    }
    throw error
  }
  // 生成token
  let token = signToken({ userInfo: { userId: result.userId } })
  // 写入token
  result.token = token
  result.updateAt = Date.now()
  result.save()
  ctx.body = res(result)
}

export let userInfo = async (ctx) => {
  let result = await models.adminUser.userDB.findOne({
    where: { userId: ctx.state.userId },
    attributes: ['userId', 'email', 'phone', 'createAt', 'updateAt']
  })
  ctx.body = res(result)
}

// 后台退出登录
export let logout = async (ctx) => {
  let result = await models.adminUser.userDB.update({ token: null }, { where: { userId: ctx.state.userId } })
  console.log(result)
  ctx.body = res('退出成功', 'success')
}

// 后台注册
export let register = async (ctx) => {
  let body = ctx.request.body,
    md5 = crypto.createHash('md5'),
    nickName = body.nickName,
    passWord = md5.update(body.passWord).digest('hex'),
    email = notNull(body.email, '邮箱'),
    phone = body.phone
  let repeat = await models.adminUser.userDB.findAll({
    where: {
      $or: [{ email }, { phone }]
    }
  })
  if (!isEmptyArr(repeat)) {
    let repeatErr = {
      code: 2000,
      msg: '用户已存在！'
    }
    throw repeatErr
  }
  let result = await models.adminUser.userDB.create({ userId: `admin_${createRandomId()}`, nickName, passWord, email, phone })
  ctx.body = res(result)
}

// 返回所有用户
export let allPpsmUser = async (ctx) => {
  let query = ctx.request.query,
    pageSize = query.pageSize,
    currentPage = query.currentPage
  let result = await models.user.userDB.findAndCountAll({
    attributes: ['id', 'userId', 'openId', 'nickName', 'gender', 'language', 'city', 'province', 'country', 'avatarUrl', 'createAt', 'updateAt'],
    limit: pageSize,
    offset: currentPage ? (currentPage - 1) * pageSize : null
  })
  result.pageNum = Math.ceil(result.count / pageSize)
  ctx.body = res(result)
}
