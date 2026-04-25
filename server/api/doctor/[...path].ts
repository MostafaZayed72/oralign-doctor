export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || ''
  const targetBase = 'https://doctors.oralign.co/api/doctor'
  const targetUrl = `${targetBase}/${path}`
  const method = getMethod(event)
  const contentType = getRequestHeader(event, 'content-type')

  // If it's a file upload (multipart), proxy the request directly to preserve boundaries
  if (contentType?.includes('multipart/form-data')) {
    return proxyRequest(event, targetUrl)
  }

  const query = getQuery(event)
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  }
  const authHeader = getRequestHeader(event, 'authorization')
  if (authHeader) headers['Authorization'] = authHeader

  let body: any = undefined
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      body = await readBody(event)
    } catch (e) {
      // Body might be empty
    }
  }

  try {
    const response = await $fetch.raw(targetUrl, {
      method,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      params: query,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
    })
    setResponseStatus(event, response.status)
    return response._data
  } catch (error: any) {
    const status = error.response?.status ?? 500
    setResponseStatus(event, status)
    return error.response?._data ?? { success: false, message: 'حدث خطأ في الاتصال بالخادم' }
  }
})
