import models from '../../models/index'
import { res, notNull } from '../../tool/Common'

export let collectList = async (ctx) => {
  //分页相关
  let body = ctx.request.body,
    pageSize = body.pageSize,
    currentPage = body.currentPage
  let type = ctx.params.type,
    result
  switch (type) {
    case 'recovery':
      result = await models.recovery.default.findAndCountAll({
        where: { status: 0 },
        limit: pageSize,
        offset: currentPage ? (currentPage - 1) * pageSize : null
      })
      result.pageNum = Math.ceil(result.count / pageSize)
      break
    case 'company':
      result = await models.company.companyDB.findAll({
        where: { status: 0 },
        limit: pageSize,
        offset: currentPage ? (currentPage - 1) * pageSize : null
      })
      result.pageNum = Math.ceil(result.count / pageSize)
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
        limit: pageSize,
          offset: currentPage ? (currentPage - 1) * pageSize : null
        })
        result.pageNum = Math.ceil(result.count / pageSize)
        }
  ctx.body = res(result)
}

export let updateCollect = async (ctx) => {

}