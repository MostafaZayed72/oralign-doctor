export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || ''
  const targetBase = 'https://doctors.oralign.co/api/admin'
  const targetUrl = `${targetBase}/${path}`
  const method = getMethod(event)
  const query = getQuery(event)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  const authHeader = getRequestHeader(event, 'authorization')
  if (authHeader) headers['Authorization'] = authHeader

  let body: any = undefined
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    body = await readBody(event).catch(() => undefined)
  }

  try {
    const response = await $fetch(targetUrl, {
      method,
      query,
      headers,
      body,
      ignoreResponseError: true,
    })
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message,
      data: error.data,
    })
  }
})
