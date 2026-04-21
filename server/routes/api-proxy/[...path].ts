import { proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  // Get the path from the parameters
  const path = event.context.params?.path || ''
  
  // Construct target URL with query parameters
  const targetBase = 'https://doctors.oralign.co/api/website'
  const queryString = event.node.req.url?.split('?')[1]
  const targetUrl = `${targetBase}/${path}${queryString ? '?' + queryString : ''}`

  console.log(`[Proxy] Forwarding ${event.node.req.url} to ${targetUrl}`)

  // Proxy the request
  return proxyRequest(event, targetUrl, {
    fetchOptions: {
      headers: {
        host: undefined
      }
    }
  })
})
