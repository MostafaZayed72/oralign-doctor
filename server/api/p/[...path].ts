export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || ''
  const targetBase = process.env.API_TARGET ?? 'https://doctors.oralign.co/api/website'
  const targetUrl = `${targetBase}/${path}`
  const method = getMethod(event)
  const query = getQuery(event)

  // Forward Authorization header if present (for protected routes)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  const authHeader = getRequestHeader(event, 'authorization')
  if (authHeader) headers['Authorization'] = authHeader

  // Read body for mutating methods
  let body: any = undefined
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await readBody(event)
  }

  try {
    const response = await $fetch.raw(targetUrl, {
      method,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      params: query,
      headers,
    })
    setResponseStatus(event, response.status)
    return response._data
  } catch (error: any) {
    const status = error.response?.status ?? 500
    setResponseStatus(event, status)
    return error.response?._data ?? { success: false, message: 'حدث خطأ في الاتصال بالخادم' }
  }
})
