export const useAuth = () => {
  const token = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 }) // 7 days
  const user = useState<any>('auth_user', () => null)
  const config = useRuntimeConfig()

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response: any = await $fetch(`${config.public.apiBase}/login`, {
        method: 'POST',
        body: credentials,
      })

      if (response?.success && response?.token) {
        token.value = response.token
        user.value = response.user || null
        return { success: true }
      }

      return { success: false, message: response?.message || 'حدث خطأ غير متوقع' }
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'فشل تسجيل الدخول. تأكد من البيانات وحاول مجدداً.'
      return { success: false, message }
    }
  }

  const fetchUser = async () => {
    if (!token.value) return
    try {
      const response: any = await $fetch(`${config.public.apiBase}/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      if (response?.success) {
        user.value = response.user
      }
    } catch {
      // Token expired or invalid
      token.value = null
      user.value = null
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await $fetch(`${config.public.apiBase}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token.value}` },
        })
      }
    } catch {
      // Ignore logout errors
    }
    token.value = null
    user.value = null
    const localePath = useLocalePath()
    navigateTo(localePath('/'))
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    fetchUser,
  }
}
