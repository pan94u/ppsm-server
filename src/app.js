// 基础组件
import Koa2 from 'koa'
import KoaBody from 'koa-body'
import KoaStatic from 'koa-static2'
import path from 'path'
import fs from 'fs'
// 配置文件
import {
  System as SystemConfig,
  session as SessionConfig
} from './config'
// 路由相关
import MainRoutes from './routes/main-routes'
import AdminRoutes from './routes/admin-routes'
import ErrorRoutesCatch from './middleware/ErrorRoutesCatch'
import ErrorRoutes from './routes/error-routes'
import { CheckAuth } from './controllers/auth'
// session
import session from 'koa-session'
// 日志
import logUtil from './tool/log'

const app = new Koa2()
const env = process.env.NODE_ENV || 'development' // Current mode

const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pub'))
app.keys = ['ppsm2019']

app
  // session
  .use(session(SessionConfig, app))

  //处理请求头
  .use(async (ctx, next) => {
    if (ctx.request.header.host.split(':')[0] === 'localhost' || ctx.request.header.host.split(':')[0] === '127.0.0.1') {
      ctx.set('Access-Control-Allow-Origin', '*')
    } else {
      ctx.set('Access-Control-Allow-Origin', SystemConfig.HTTP_server_host)
    }
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization')
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Credentials', true) // 允许带上 cookie
    // 预检全部200通过
    if (ctx.method == 'OPTIONS') {
      ctx.body = 200;
    } else {
      return next()
    }
  })

  // 
  .use(ErrorRoutesCatch())
  // 处理静态文件
  .use(KoaStatic('assets', path.resolve(__dirname, '../assets'))) // Static resource
  //集成koa-unless
  .use(CheckAuth().unless({ path: [/^\/public|\/*\/login|\/*\/reg|\/assets|\/hello|\/price/] }))
  // 处理上传
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

  // log res
  .use(async (ctx, next) => {
    const start = new Date();
    var ms;
    try {
      //开始进入到下一个中间件
      await next();
      ms = new Date() - start;
      //记录响应日志
      logUtil.logResponse(ctx, ms);
    } catch (error) {
      ms = new Date() - start;
      //记录异常日志
      logUtil.logError(ctx, error, ms);
    }
  })

  // 捕获错误
  .use((ctx, next) => {
    return next().catch((err) => {
      // log原生错误
      if (err.stack) {
        logUtil.logError(ctx, err)
      }
      // res错误
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
  .use(ErrorRoutes())

// 开发环境控制台log
if (env === 'development') { // logger
  app.use((ctx, next) => {
    const start = new Date()
    return next().then(() => {
      const ms = new Date() - start
      console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })
  })
}

// 听端口开始工作
app.listen(SystemConfig.API_server_port)
// 开始工作了吗？
console.log('Now start API server on port ' + SystemConfig.API_server_port + '...')

export default app
