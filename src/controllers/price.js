import models from '../models/index'
import { res } from '../tool/Common'
export let Get = async (ctx) => {
  console.log(`access Get~`)
  models.price.priceDB.belongsTo(models.model.modelDB, { foreignKey: 'modelId', targetKey: 'id' })
  let group = await models.group.groupDB.findAll({
    attributes: ['id', ['name', 'groupName'], 'hot', 'new', 'weight'],
    order: [['weight', 'DESC']], //按权重排序
    where: { status: 0 }
  })
  let result = []
  let fn = (elem) => {
    return new Promise(async (resolve) => {
      let groupId = elem.dataValues.id
      let groupName = elem.dataValues.groupName
      let hotFlag = elem.dataValues.hot
      let newFlag = elem.dataValues.new
      let weight = elem.dataValues.weight
      let priceObj = {}
      let priceSingle = await models.price.priceDB.findAll({
        include: [{
          model: models.model.modelDB,
          attributes: [['name', 'modelName'], 'color', ['weight_apt', 'weight']],
          order: [['weight_apt', 'ASC']]
        }],
        attributes: ['id', 'price', 'modelId', 'groupId', 'country'],
        where: { groupId, status: 0 },
        // order: [['modelId', 'ASC']]
      }) //查询价格（左连接型号表）
      for (let i in priceSingle) {
        for (let j in priceSingle[i].sp_model.dataValues) {
          priceSingle[i].dataValues[j] = priceSingle[i].sp_model.dataValues[j]
        } //遍历model 把结果循环到外层
        delete priceSingle[i].dataValues.sp_model //遍历完成后删除model
      }
      // priceSingle.sort(sortByName('weight'))
      priceObj = {
        groupId,
        groupName,
        hotFlag,
        newFlag,
        weight,
        item: priceSingle
      }
      result.push(priceObj)
      resolve()
    })
  }
  await Promise.all(group.map(fn)) //等待group遍历处理完成
  result.sort(sortByName('weight'))
  ctx.body = res(result, 'success')
}

export let origin = async (ctx) => {
  let result = await models.price.priceDB.findAll()
  ctx.body = res(result)
}
function sortByName(propertyName) {
  return function (obj1, obj2) {
    let value1 = obj1[propertyName]
    let value2 = obj2[propertyName]
    if (value2 > value1) {
      return 1;
    } else if (value2 < value1) {
      return -1;
    } else {
      return 0
    }
  }
} 
