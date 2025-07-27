import type { Context } from 'hono'
import type { UmamiPostRequest } from '../interface/UmamiPostRequest.js'
import { getClientIp } from './getClientIp.js'

export const track = async (c: Context) => {
  // check if the request is for a valid website ID, if set
  if (process.env.ALLOWED_WEBSITE_IDS) {
    const allowedWebsiteIds = process.env.ALLOWED_WEBSITE_IDS.split(',')
    const websiteId = c.req.param('websiteId')
    if (!allowedWebsiteIds.includes(websiteId)) {
      console.warn(`Website ID ${websiteId} is not allowed.`)
      return c.status(403)
    }
  }

  // get UTM parameters from the request query
  const utm = {
    utm_source: c.req.query('utm_source'),
    utm_medium: c.req.query('utm_medium'),
    utm_campaign: c.req.query('utm_campaign'),
    utm_content: c.req.query('utm_content'),
    utm_term: c.req.query('utm_term'),
  }

  // build the URL with UTM parameters
  let url = '/' + c.req.path.split('/').slice().slice(3).join('/')
  const urlSeachParams = new URLSearchParams()
  Object.entries(utm).forEach(([key, value]) => {
    if (value) {
      urlSeachParams.append(key, value)
    }
  })
  url += urlSeachParams.toString() ? `?${urlSeachParams.toString()}` : ''

  // get other special query parameters
  const name = c.req.query('event')
  const title = c.req.query('title')
  const tag = c.req.query('tag')

  // put all other query parameters into the data object
  const data = Object.fromEntries(
    Object.entries(c.req.query()).filter(
      ([key]) =>
        ![
          'event',
          'title',
          'tag',
          'utm_source',
          'utm_medium',
          'utm_campaign',
          'utm_content',
          'utm_term',
        ].includes(key),
    ),
  )

  // get the language from the request header
  const language = c.req.header('accept-language')?.split(',')[0]

  const body: UmamiPostRequest = {
    type: 'event',
    payload: {
      website: c.req.param('websiteId'),
      url,
      language,
      referrer: c.req.header('referer'),
      hostname: c.req.header('host'),

      ip: getClientIp(c) || undefined,
      userAgent: c.req.header('user-agent'),

      name,
      title,
      tag,

      data,
    },
  }

  try {
    const res = await fetch(process.env.UMAMI_BASE_URL + '/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch (error) {
    console.error('Error sending tracking data:', error)
  }
}
