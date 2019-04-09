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
  .post('/enum/country', controllers.admin.enum.addCountry)
  .put('/enum/country', controllers.admin.enum.updateCountry)
  .delete('/enum/country', controllers.admin.enum.deleteCountry)
  .get('/enum/volume', controllers.admin.enum.volumeList)
  .post('/enum/volume', controllers.admin.enum.addVolume)
  .put('/enum/volume', controllers.admin.enum.updateVolume)
  .delete('/enum/volume', controllers.admin.enum.deleteVolume)
  
  .get('/enum/quality', controllers.admin.enum.qualityList)

module.exports = router
