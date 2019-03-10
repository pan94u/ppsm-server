import models from '../models/index'
import {res} from '../tool/Common'
export let Get =async (ctx) => {
  console.log(`access Get~`)
  models.price.priceDB.belongsTo(models.model.modelDB, {foreignKey:'modelId', targetKey: 'id'})
  let group = await models.group.groupDB.findAll({
    attributes: ['id', ['name', 'modelName']]
  })
  let result = []
  let fn = (elem) => {
    return new Promise(async (resolve) => {
      let groupId = elem.dataValues.id
      let groupName = elem.dataValues.modelName
      let priceObj = {}
      let priceSingle = await models.price.priceDB.findAll({
        include: [{
          model: models.model.modelDB,
          attributes: [['name', 'modelName'], 'color'],
        }],
        attributes: ['id', 'price', 'modelId', 'groupId', 'country'],
        where: {groupId,status:0}
      }) //查询价格（左连接型号表）
      for(let i in priceSingle) {
        for(let j in priceSingle[i].sp_model.dataValues) {
          priceSingle[i].dataValues[j] = priceSingle[i].sp_model.dataValues[j]
        } //遍历model 把结果循环到外层
        delete priceSingle[i].dataValues.sp_model //遍历完成后删除model
      }
      priceObj = {
        groupId,
        groupName,
        item: priceSingle
      }
      result.push(priceObj)
      resolve()
    })
  }
  await Promise.all(group.map(fn)) //等待group遍历处理完成
  ctx.body = res(result,'success')
}
