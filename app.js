import Koa from 'koa'
import logger from 'koa-logger'
import bodyparser from 'koa-bodyparser'
import koaRouter from 'koa-router'
import fetch from 'node-fetch'

import config from './config'

const app = new Koa()

const route = (() => {
  const router = koaRouter()
  let temp = 'nothing'

  router.prefix('/')

  router.get('/:key/:lon/:lat', async (ctx, next) => {
    try {
      if(ctx.params.key === config.KEY) {
        temp = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${ ctx.params.lat }&lon=${ ctx.params.lon }&appid=${ config.APIKEY }`)
        temp = await temp.json()
      } else {
        temp = 'request not found or key not matched'
        ctx.body = temp

        return
      }

      ctx.body = {
        temp : {
          coords : temp.coord,
          weather : temp.weather,
          id : temp.id,
          name : temp.name,
          code : temp.cod
        }
      }
    } catch (er) {
      console.log(er)
    }
  })

  router.get('/', async (ctx) => {
    ctx.body = 'hola mundo'
  })

  return router
})()

app
  .use(bodyparser())
  .use(logger())
  .use(route.routes())
  .use(route.allowedMethods())

app.listen(config.PORT, () => {
  if(config.ENV === 'development')
    console.log(`started server at ${ config.PORT }`)
})
