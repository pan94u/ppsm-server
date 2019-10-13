import models from '../models/index'
import { res } from '../tool/Common'
import { seq } from '../lib/sequelize'
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

      // 2019.9.23更新，使用sql语句处理
      let priceSingle = await seq.query('SELECT `sp_price`.`id`, `sp_price`.`price`, `sp_price`.`modelId`, `sp_price`.`groupId`, `sp_price`.`country` , `sp_model`.`id` AS `sp_model.id`, `sp_model`.`name` AS `modelName`, `sp_model`.`color`, `sp_model`.`weight_apt` FROM `sp_price` `sp_price` LEFT JOIN `sp_model` `sp_model` ON `sp_price`.`modelId` = `sp_model`.`id` WHERE `sp_price`.`groupId` = ? AND `sp_price`.`status` = 0 ORDER BY `sp_model`.`weight_apt` ASC;',
      { replacements: [groupId]})

      // 老方法
      // let priceSingle = await models.price.priceDB.findAll({
      //   include: [{
      //     model: models.model.modelDB,
      //     attributes: [['name', 'modelName'], 'color', ['weight_apt', 'weight']]
      //   }],
      //   attributes: ['id', 'price', 'modelId', 'groupId', 'country'],
      //   where: { groupId, status: 0 },
      //   order: [['modelId', 'ASC']]
      // }) //查询价格（左连接型号表）

      // for (let i in priceSingle) {
      //   if(!priceSingle[i].sp_model.dataValues) {console.log(priceSingle[i].sp_model)}
      //   for (let j in priceSingle[i].sp_model.dataValues) {
      //     if(!priceSingle[i].dataValues) {console.log(priceSingle[i].dataValues)}
      //     priceSingle[i].dataValues[j] = priceSingle[i].sp_model.dataValues[j]
      //   } //遍历model 把结果循环到外层
      //   delete priceSingle[i].dataValues.sp_model //遍历完成后删除model
      // }
      priceObj = {
        groupId,
        groupName,
        hotFlag,
        newFlag,
        weight,
        item: priceSingle[0]
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
