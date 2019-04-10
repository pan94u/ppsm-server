import models from '../../models/index'
import { res, notNull } from '../../tool/Common'

// 容量增删改查
export let volumeList = async (ctx) => {
  let result = await models.volumeList.volumeListDB.findAll({ where: { status: 0 } })
  ctx.body = res(result)
}

export let addVolume = async (ctx) => {
  let body = ctx.request.body,
    volumeName = notNull(body.volumeName, '容量名称')
  let result = await models.volumeList.volumeListDB.create({ name: volumeName })
  ctx.body = res(result, '添加成功')
}

export let updateVolume = async (ctx) => {
  let body = ctx.request.body,
    volumeId = notNull(body.volumeId, 'volumeId'),
    volumeName = notNull(body.volumeName, '容量名称')
  let result = await models.volumeList.volumeListDB.update({ name: volumeName }, { where: { id: volumeId }, individualHooks: true })
  if (result[0] == 0) {
    ctx.status = 500
    ctx.body = res(null, '更新失败')
  } else {
    ctx.body = res(result, '更新成功')
  }
}

export let deleteVolume = async (ctx) => {
  let body = ctx.request.body,
    volumeId = notNull(body.volumeId, 'volumeId'),
    force = body.force,
    result
  if (force) {
    result = await models.volumeList.volumeListDB.destroy({ where: { id: volumeId } })
  } else {
    result = await models.volumeList.volumeListDB.update({ status: 2 }, { where: { id: volumeId }, individualHooks: true })
  }
  if (result[0] == 0) {
    ctx.status = 500
    ctx.body = res(null, '删除失败')
  } else {
    ctx.body = res(result, '删除成功')
  }
}

//国家增删改查
export let countryList = async (ctx) => {
  let result = await models.countryList.countryListDB.findAll({ where: { status: 0 } })
  ctx.body = res(result)
}

export let addCountry = async (ctx) => {
  let body = ctx.request.body,
    countryName = notNull(body.countryName, '国家名称')
  let result = await models.countryList.countryListDB.create({ name: countryName })
  ctx.body = res(result, '添加成功')
}

export let updateCountry = async (ctx) => {
  let body = ctx.request.body,
    countryId = notNull(body.countryId, 'countryId'),
    countryName = notNull(body.countryName, '国家名称')
  let result = await models.countryList.countryListDB.update({ name: countryName }, { where: { id: countryId }, individualHooks: true })
  if (result[0] == 0) {
    ctx.status = 500
    ctx.body = res(null, '更新失败')
  } else {
    ctx.body = res(result, '更新成功')
  }
}

export let deleteCountry = async (ctx) => {
  let body = ctx.request.body,
    countryId = notNull(body.countryId, 'countryId'),
    force = body.force,
    result
  if (force) {
    result = await models.countryList.countryListDB.destroy({ where: { id: countryId } })
  } else {
    result = await models.countryList.countryListDB.update({ status: 2 }, { where: { id: countryId }, individualHooks: true })
  }
  if (result[0] == 0) {
    ctx.status = 500
    ctx.body = res(null, '删除失败')
  } else {
    ctx.body = res(result, '删除成功')
  }
}

// 成色增删改查
export let qualityList = async (ctx) => {
  let result = await models.qualityList.qualityListDB.findAll({ where: { status: 0 } })
  ctx.body = res(result)
}

export let addQuality = async (ctx) => {
  let body = ctx.request.body,
    qualityName = notNull(body.qualityName, '国家名称')
  let result = await models.qualityList.qualityListDB.create({ name: qualityName })
  ctx.body = res(result, '添加成功')
}

export let updateQuality = async (ctx) => {
  let body = ctx.request.body,
    qualityId = notNull(body.qualityId, 'qualityId'),
    qualityName = notNull(body.qualityName, '国家名称')
  let result = await models.qualityList.qualityListDB.update({ name: qualityName }, { where: { id: qualityId }, individualHooks: true })
  if (result[0] == 0) {
    ctx.status = 500
    ctx.body = res(null, '更新失败')
  } else {
    ctx.body = res(result, '更新成功')
  }
}

export let deleteQuality = async (ctx) => {
  let body = ctx.request.body,
    qualityId = notNull(body.qualityId, 'countryId'),
    force = body.force,
    result
  if (force) {
    result = await models.qualityList.qualityListDB.destroy({ where: { id: qualityId } })
  } else {
    result = await models.qualityList.qualityListDB.update({ status: 2 }, { where: { id: qualityId }, individualHooks: true })
  }
  if (result[0] == 0) {
    ctx.status = 500
    ctx.body = res(null, '删除失败')
  } else {
    ctx.body = res(result, '删除成功')
  }
}