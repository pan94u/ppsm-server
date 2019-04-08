import models from '../../models/index'
import { res } from '../../tool/Common'

export let volumeList = async (ctx) => {
  let result = await models.volumeList.volumeListDB.findAll()
  ctx.body = res(result)
}

export let countryList = async (ctx) => {
  let result = await models.countryList.countryListDB.findAll()
  ctx.body = res(result)
}

export let qualityList = async (ctx) => {
  let result = await models.qualityList.qualityListDB.findAll()
  ctx.body = res(result)
}