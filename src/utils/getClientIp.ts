import { getConnInfo } from '@hono/node-server/conninfo'
import type { Context } from 'hono'

export const getClientIp = (c: Context): string | null => {
  // Check if the request is from a trusted proxy
  const trustedProxyIps = (process.env.TRUSTED_PROXY_IPS || '').split(',')
  const proxyIpHeader = process.env.PROXY_IP_HEADER || 'X-Forwarded-For'

  const connInfo = getConnInfo(c)

  // no remote address, or not a trusted proxy
  if (
    !connInfo.remote.address ||
    !trustedProxyIps.includes(connInfo.remote.address)
  ) {
    return connInfo.remote.address || null
  }

  const ip = c.req.header(proxyIpHeader)

  return ip || null
}
