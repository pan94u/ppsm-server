import models from '../../models/index'
import { res, notNull } from '../../tool/Common'

export let collectList = async (ctx) => {
  //分页相关
  let query = ctx.request.query,
    pageSize = query.pageSize,
    currentPage = query.currentPage
  let type = ctx.params.type,
    result
  switch (type) {
    case 'recovery':
      models.recovery.default.hasMany(models.user.userDB, { foreignKey: 'userId', sourceKey: 'userId' })
      result = await models.recovery.default.findAndCountAll({
        include: [
          {
            model: models.user.userDB,
            attributes: ['userId', 'openid', 'nickName', 'avatarUrl']
          }
        ],
        where: { status: 0 },
        limit: pageSize,
        offset: currentPage ? (currentPage - 1) * pageSize : null
      })
      result.pageNum = Math.ceil(result.count / pageSize)
      break
    case 'company':
      models.company.default.hasMany(models.user.userDB, { foreignKey: 'userId', sourceKey: 'userId' })
      result = await models.company.default.findAll({
        include: [
          {
            model: models.user.userDB,
            attributes: ['userId', 'openid', 'nickName', 'avatarUrl']
          }
        ],
        where: { status: 0 },
        attributes: ['id', 'userId', 'companyName', 'companyContact', 'companyContactPhoneNumber', 'tradeMode', 'model', 'volume', 'quality', 'targetPrice', 'num', 'createAt', 'replyStatus', 'replyText'],
        limit: pageSize,
        offset: currentPage ? (currentPage - 1) * pageSize : null
      })
      result.pageNum = Math.ceil(result.count / pageSize)
      break
    case 'sh':
      models.secondHand.shDB.hasMany(models.user.userDB, { foreignKey: 'userId', sourceKey: 'userId' })
      models.secondHand.shDB.hasMany(models.volumeList.volumeListDB, { foreignKey: 'name', sourceKey: 'volume' })
      result = await models.secondHand.shDB.findAndCountAll({
        include: [
          {
            model: models.user.userDB,
            attributes: ['userId', 'openid', 'nickName', 'avatarUrl']
          },
          {
            model: models.volumeList.volumeListDB,
            attributes: [['id', 'volumeId'], ['name', 'volumeName']]
          }
        ],
        where: { status: 0 },
        attributes: ['id', 'formId','userId', 'model', 'volume', 'quality', 'targetPrice', 'phoneNumber', 'createAt', 'replyStatus', 'replyText'],
        limit: pageSize,
        offset: currentPage ? (currentPage - 1) * pageSize : null
      })
      result.pageNum = Math.ceil(result.count / pageSize)
      break
    default:
      result = { code: 500, msg: '别瞎请求！' }
      throw result
  }
  ctx.body = res(result)
}

export let updateCollect = async (ctx) => {
  let body = ctx.request.body,
    replyStatus = notNull(body.replyStatus, '回复状态'),
    replyText = notNull(body.replyText, '回复信息'),
    id = notNull(body.id, 'id'),
    type = notNull(ctx.params.type, type),
    result,
    model
  switch (type) {
    case 'recovery':
      model = models.recovery.default
      break
    case 'company':
      model = models.company.default
      break
    case 'sh':
      model = models.secondHand.shDB
      break
    default:
      result = { code: 500, msg: '别瞎请求！' }
      throw result
  }
  model.update({ replyStatus, replyText }, { where: { id }, individualHooks: true })
  ctx.body = res(result, '更新成功！')
}