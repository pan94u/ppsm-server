import sequelize from '../lib/sequelize.js'
const crypto = require('crypto')
export let Reg = (ctx) => {
  const md5 = crypto.createHash('md5')
  let userid = ctx.request.body.userid || ''
  let password = ctx.request.body.password || ''
  if (!userid || !password) {
    ctx.body = {
      result: 'reg fail'
    }
    return
  }
  password = md5.update(password).digest('hex')
  sequelize.query('select * from ppsm_product_relation').then(rows => {
    // console.log(JSON.stringify(rows))
  })
  // 写数据库
  // 获取token
  ctx.body = {
    result: 'reg success',
    userid: userid,
    password: password,
    para: ctx.query
  }
}
