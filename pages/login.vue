<template>
  <div class="min-h-[70vh] bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ $t('login') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          سجل دخولك للوصول إلى لوحة تحكم الطبيب
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4 flex flex-col">
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required class="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d6b25c] focus:border-[#d6b25c] sm:text-sm transition-colors" placeholder="example@email.com" v-model="form.email">
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">كلمة المرور</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d6b25c] focus:border-[#d6b25c] sm:text-sm transition-colors" placeholder="••••••••" v-model="form.password">
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          {{ error }}
        </div>

        <div>
          <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-[#063d37] bg-[#d6b25c] hover:bg-[#f2d98b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d6b25c] transition-all duration-200 disabled:opacity-70 shadow-lg shadow-black/10">
            <span class="absolute end-0 inset-y-0 flex items-center pe-3">
              <i class="fas fa-sign-in-alt text-[#063d37]/50 group-hover:text-[#063d37] transition-colors" />
            </span>
            {{ loading ? 'جاري تسجيل الدخول...' : $t('login') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const localePath = useLocalePath()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const result = await login(form)
  
  if (result.success) {
    router.push(localePath('/dashboard'))
  } else {
    error.value = result.message || 'حدث خطأ أثناء تسجيل الدخول. يرجى التأكد من البيانات والمحاولة مجدداً.'
  }
  
  loading.value = false
}
</script>
