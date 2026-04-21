export default defineEventHandler(async (event) => {
  const targetUrl = 'https://doctors.oralign.co/api/website/home?lang=ar'
  console.log(`[Proxy Test] Fetching ${targetUrl}`)
  
  try {
    const data = await $fetch(targetUrl)
    return data
  } catch (err: any) {
    console.error('[Proxy Test] Error:', err.message)
    return { error: err.message }
  }
})
