import KoaRouter from 'koa-router'
import controllers from '../controllers/index.js'

const router = new KoaRouter({
  prefix: '/admin'
})

router
  .post('/login', controllers.admin.user.login)
  .post('/register', controllers.admin.user.register)
  .get('/user', controllers.admin.user.allPpsmUser)
  .get('/enum/country', controllers.admin.enum.countryList)
  .get('/enum/volume', controllers.admin.enum.volumeList)
  .get('/enum/quality', controllers.admin.enum.qualityList)

module.exports = router
