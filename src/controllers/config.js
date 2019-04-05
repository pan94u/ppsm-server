import models from '../models/index'
import { res, notNull } from '../tool/Common'

//二手求购配置信息
export let sh = async (ctx) => {
  let qualityData = await models.qualityList.qualityListDB.findAll(),
    volumeData = await models.volumeList.volumeListDB.findAll(),
    qualityList = [],
    volumeList = [],
    result = {}
  //获取成色列表
  for (let i in qualityData) {
    if ((qualityData[i].apply).indexOf('sh') > -1) {
      qualityList.push({ id: qualityData[i].id, name: qualityData[i].name }
      )
    }
  }
  //获取容量列表
  for (let i in volumeData) {
    if ((volumeData[i].apply).indexOf('') > -1) {
      volumeList.push({ id: volumeData[i].id, name: volumeData[i].name }
      )
    }
  }
  Object.assign(result, { qualityList }, { volumeList })
  ctx.body = res(result, 'success')
}

//回收登记配置信息
export let recoveryRecord = async (ctx) => {
  let volumeData = await models.volumeList.volumeListDB.findAll(),
    countryData = await models.countryList.countryListDB.findAll(),
    volumeList = [],
    countryList = [],
    result = {}
  //获取容量列表
  for (let i in volumeData) {
    if ((volumeData[i].apply).indexOf('') > -1) {
      volumeList.push({ id: volumeData[i].id, name: volumeData[i].name }
      )
    }
  }
  //获取国家列表
  for (let i in countryData) {
    if ((countryData[i].apply).indexOf('') > -1) {
      countryList.push({ id: countryData[i].id, name: countryData[i].name }
      )
    }
  }
  Object.assign(result, { volumeList }, { countryList })
  ctx.body = res(result, 'success')
}