import models from '../models/index'
export let Get =async (ctx) => {
  console.log(`access Get~`)
  let result = await models.group.groupDB.findAll()
  ctx.body = {
    result: result,
    succuss: true
  }
}
