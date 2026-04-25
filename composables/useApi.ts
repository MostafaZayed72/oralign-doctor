// Thin wrapper around $fetch that automatically injects the API base URL
// and the current locale as a `lang` query param.

export const useApi = () => {
  const config = useRuntimeConfig()
  const { locale } = useI18n()
  const { token } = useAuth()

  const base = config.public.apiProxyBase as string

  const get = <T = any>(path: string, params: Record<string, any> = {}): Promise<T> =>
    $fetch<T>(`${base}/${path}`, {
      params: { lang: locale.value, ...params },
      headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
    })

  const post = <T = any>(path: string, body: Record<string, any>): Promise<T> =>
    $fetch<T>(`${base}/${path}`, {
      method: 'POST',
      body,
      params: { lang: locale.value },
      headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
    })

  return { get, post, base }
}
