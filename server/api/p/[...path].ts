import { proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || ''
  
  // Use environment variable or fallback to production URL
  const targetBase = process.env.API_TARGET || 'https://doctors.oralign.co/api/website'
  const queryString = event.node.req.url?.split('?')[1]
  const targetUrl = `${targetBase}/${path}${queryString ? '?' + queryString : ''}`

  console.log(`[Proxy] ${event.node.req.method} -> ${targetUrl}`)

  return proxyRequest(event, targetUrl)
})
