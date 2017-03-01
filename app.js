import Koa from 'koa'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'
import koaRouter from 'koa-router'
import fetch from 'fetch'

import config from './config'

const server = new Koa()

const route = () => {
  const router = koaRouter()

  router.get('/:key/:lon/:lat', async (ctx, next) => {
    try {
      const temp = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${ ctx.params.lat }&lon=${ ctx.params.lon }&appid=${ config.APIKEY }`)
      ctx.body = { temp }
    } catch (er) {
      //
    }
  })

  return router
}

server
  .use(bodyparser())
  .use(logger())
  .use(route.routes())
  .use(route.allowedRoutes())

server.listen(config.PORT, () => {
  // console.log()
})
