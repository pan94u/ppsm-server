import Koa2 from 'koa'
import KoaBody from 'koa-body'
import KoaStatic from 'koa-static2'
import {
  System as SystemConfig,
  session as SessionConfig
} from './config'
import path from 'path'
import MainRoutes from './routes/main-routes'
import AdminRoutes from './routes/admin-routes'
import ErrorRoutesCatch from './middleware/ErrorRoutesCatch'
import ErrorRoutes from './routes/error-routes'
import fs from 'fs'
import { CheckAuth } from './controllers/auth'
import session from 'koa-session'
// import PluginLoader from './lib/PluginLoader'

const app = new Koa2()
const env = process.env.NODE_ENV || 'development' // Current mode

const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pub'))
app.keys = ['ppsm2019']

app
  .use(session(SessionConfig, app))
  .use((ctx, next) => {
    if (ctx.request.header.host.split(':')[0] === 'localhost' || ctx.request.header.host.split(':')[0] === '127.0.0.1') {
      ctx.set('Access-Control-Allow-Origin', '*')
    } else {
      ctx.set('Access-Control-Allow-Origin', SystemConfig.HTTP_server_host)
    }
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Credentials', true) // 允许带上 cookie
    return next()
  })
  .use(ErrorRoutesCatch())
  .use(KoaStatic('assets', path.resolve(__dirname, '../assets'))) // Static resource
  //集成koa-unless
  .use(CheckAuth().unless({ path: [/^\/public|\/*\/login|\/*\/reg|\/assets|\/hello|\/price/] }))
  .use(KoaBody({
    multipart: true,
    strict: false,
    formidable: {
      uploadDir: path.join(__dirname, '../assets/uploads/tmp')
    },
    jsonLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb'
  })) // Processing request
  // .use(PluginLoader(SystemConfig.System_plugin_path))
  .use((ctx, next) => {
    return next().catch((err) => {
      console.log(err)
      ctx.status = err.statusCode || 500
      ctx.body = {
        code: err.code || -1,
        msg: err.msg || '服务器出门遛弯了，请稍后再试！'
      }
    })
  })
  .use(MainRoutes.routes())
  .use(MainRoutes.allowedMethods())
  .use(AdminRoutes.routes())
  .use(AdminRoutes.routes())
  .use(ErrorRoutes())

if (env === 'development') { // logger
  app.use((ctx, next) => {
    const start = new Date()
    return next().then(() => {
      const ms = new Date() - start
      console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })
  })
}

app.listen(SystemConfig.API_server_port)

console.log('Now start API server on port ' + SystemConfig.API_server_port + '...')

export default app
