import { getConnInfo } from '@hono/node-server/conninfo'
import type { Context } from 'hono'
import ipaddr from 'ipaddr.js'

export const getClientIp = (c: Context): string | null => {
  // Check if the request is from a trusted proxy
  const trustedProxyIps = (process.env.TRUSTED_PROXY_IPS || '')
    .split(',')
    .filter((x) => x)
  const proxyIpHeader = process.env.PROXY_IP_HEADER || 'X-Forwarded-For'

  const connInfo = getConnInfo(c)

  // ignore if remote address is not set
  if (!connInfo.remote.address) {
    return null
  }

  // parse trusted proxy IPs and remote address
  const trustedProxyCidrs = trustedProxyIps.map((ip) => {
    if (ipaddr.isValidCIDR(ip)) {
      return ipaddr.parseCIDR(ip)
    }
    if (ipaddr.isValid(ip)) {
      return ipaddr.parseCIDR(ip + (ipaddr.IPv6.isValid(ip) ? '/128' : '/32'))
    }
    throw new Error(
      `Invalid trusted proxy IP or CIDR format: ${ip}. Expected valid IP address or CIDR notation (e.g., 192.168.1.1 or 192.168.1.0/24)`,
    )
  })
  const remoteAddress = ipaddr.process(connInfo.remote.address)

  // check if the remote address is in the list of trusted proxy CIDRs
  const isTrustedProxy = trustedProxyCidrs.some((cidr) => {
    return remoteAddress.match(cidr)
  })

  if (!isTrustedProxy) {
    return connInfo.remote.address
  }

  // trusted proxy
  const ip = c.req.header(proxyIpHeader)
  return ip || null
}
