import models from '../../models/index'
import { res, notNull } from '../../tool/Common'
import Sequelize from 'sequelize'
const Op = Sequelize.Op
export let collectList = async (ctx) => {
  //分页相关
  let query = ctx.request.query,
    pageSize = parseInt(query.pageSize),
    currentPage = parseInt(query.currentPage),
    formId = query.formId ? parseInt(query.formId) : '',
    replyStatus = parseInt(query.replyStatus)
  let where = {
    status: 0,
    replyStatus,
    formId: {
      [Op.like]: `%${formId}%`
    }
  }
  // 如果不给状态，默认全部
  if (where.replyStatus == 0) {
    delete where.replyStatus
  }
  let type = ctx.params.type,
    result
  switch (type) {
    case 'recovery':
      models.recovery.default.hasMany(models.user.userDB, { foreignKey: 'userId', sourceKey: 'userId' })
      result = await models.recovery.default.findAndCountAll({
        include: [
          {
            model: models.user.userDB,
            attributes: ['id', 'userId', 'openid', 'nickName', 'avatarUrl']
          }
        ],
        where,
        limit: pageSize,
        offset: currentPage ? (currentPage - 1) * pageSize : null
      })
      result.pageNum = Math.ceil(result.count / pageSize)
      // 通过找model名来确定嵌套key
      for (let item in result.rows) {
        result.rows[item].dataValues.userInfo = result.rows[item].dataValues[`${models.user.userDB.getTableName()}s`][0]
        delete result.rows[item].dataValues[`${models.user.userDB.getTableName()}s`]
      }
      break
    case 'company':
      models.company.default.hasMany(models.user.userDB, { foreignKey: 'userId', sourceKey: 'userId' })
      models.company.default.hasMany(models.qualityList.qualityListDB, { foreignKey: 'id', sourceKey: 'quality' })
      result = await models.company.default.findAndCountAll({
        include: [
          {
            model: models.user.userDB,
            attributes: ['userId', 'openid', 'nickName', 'avatarUrl']
          },
          {
            model: models.qualityList.qualityListDB,
            attributes: [['id', 'qualityId'], ['name', 'qualityName']]
          }
        ],
        where,
        attributes: ['id', 'formId', 'userId', 'companyName', 'companyContact', 'companyContactPhoneNumber', 'tradeMode', 'model', 'volume', 'quality', 'targetPrice', 'num', 'createAt', 'replyStatus', 'replyText'],
        limit: pageSize,
        offset: currentPage ? (currentPage - 1) * pageSize : null
      })
      result.pageNum = Math.ceil(result.count / pageSize)
      // 通过找model名来确定嵌套key
      for (let item in result.rows) {
        result.rows[item].dataValues.userInfo = result.rows[item].dataValues[`${models.user.userDB.getTableName()}s`][0]
        result.rows[item].dataValues.volumeInfo = result.rows[item].dataValues[`${models.qualityList.qualityListDB.getTableName()}s`][0]
        delete result.rows[item].dataValues[`${models.user.userDB.getTableName()}s`]
        delete result.rows[item].dataValues[`${models.qualityList.qualityListDB.getTableName()}s`]
      }
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
        where,
        attributes: ['id', 'formId', 'userId', 'model', 'volume', 'quality', 'targetPrice', 'phoneNumber', 'createAt', 'replyStatus', 'replyText'],
        limit: pageSize,
        offset: currentPage ? (currentPage - 1) * pageSize : null
      })
      result.pageNum = Math.ceil(result.count / pageSize)
      // 通过手写嵌套key来解嵌套
      for (let item in result.rows) {
        result.rows[item].dataValues.userInfo = result.rows[item].dataValues.pss_users[0]
        result.rows[item].dataValues.volumeInfo = result.rows[item].dataValues.pss_volume_lists[0]
        delete result.rows[item].dataValues.pss_users
        delete result.rows[item].dataValues.pss_volume_lists
      }
      break
    case 'feedback':
      models.feedback.feddbackDB.hasMany(models.user.userDB, { foreignKey: 'userId', sourceKey: 'userId' })
      // feedback没有formId
      delete where.formId
      if(query.id) {
        where.id = query.id
      }
      result = await models.feedback.feddbackDB.findAndCountAll({
        include: [
          {
            model: models.user.userDB,
            attributes: ['userId', 'openid', 'nickName', 'avatarUrl']
          }
        ],
        where,
        attributes: ['id', 'userId', 'name', 'email', 'feedback', 'createAt', 'updateAt', 'replyStatus', 'replyText'],
        limit: pageSize,
        offset: currentPage ? (currentPage - 1) * pageSize : null
      })
      result.pageNum = Math.ceil(result.count / pageSize)
      // 通过找model名来确定嵌套key
      for (let item in result.rows) {
        result.rows[item].dataValues.userInfo = result.rows[item].dataValues[`${models.user.userDB.getTableName()}s`][0]
        delete result.rows[item].dataValues[`${models.user.userDB.getTableName()}s`]
      }
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