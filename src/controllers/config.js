import models from '../models/index'
import { res } from '../tool/Common'

//二手求购配置信息
export let sh = async (ctx) => {
  let qualityData = await models.qualityList.qualityListDB.findAll({ where: { status: 0 } }),
    volumeData = await models.volumeList.volumeListDB.findAll({ where: { status: 0 } }),
    qualityList = [],
    volumeList = [],
    result = {}
  //获取成色列表
  for (let i in qualityData) {
    if ((qualityData[i].apply).indexOf('') > -1) {
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
  let volumeData = await models.volumeList.volumeListDB.findAll({ where: { status: 0 } }),
    countryData = await models.countryList.countryListDB.findAll({ where: { status: 0 } }),
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