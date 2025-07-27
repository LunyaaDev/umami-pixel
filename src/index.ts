import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { track } from './utils/track.js'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(cors())

app.get('/:responseType/:websiteId/*', async (c) => {
  track(c)

  switch (c.req.param('responseType')) {
    case 'pxl':
      c.header('Content-Type', 'image/png')
      return c.body(
        Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NgAAIAAAUAAR4f7BQAAAAASUVORK5CYII=',
          'base64',
        ),
      )
    case 'req':
      return c.status(204)
  }
  return c.status(404)
})

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
