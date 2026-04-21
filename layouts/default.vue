<template>
  <div :dir="dir" :lang="locale" :class="{ 'rtl': isRtl }">
    <!-- Head: favicon & fonts -->
    <Head>
      <Link v-if="settings?.configration?.fav_icon" rel="icon" :href="settings.configration.fav_icon" />
    </Head>

    <!-- Particle Background for Dark Mode -->
    <div class="particles-bg">
      <div v-for="i in 15" :key="i" class="particle" :style="{
        '--left': `${Math.random() * 100}%`,
        '--top': `${Math.random() * 100}%`,
        '--size': `${Math.random() * 10 + 5}px`,
        '--duration': `${Math.random() * 5 + 5}s`,
        '--x': `${Math.random() * 100 - 50}px`,
        '--y': `${Math.random() * 100 - 50}px`
      }"></div>
    </div>

    <AppHeader />

    <main>
      <slot />
    </main>

    <AppFooter :settings="settings" />

    <!-- Back to top -->
    <a
      v-show="showBackTop"
      href="#"
      class="fixed bottom-6 end-6 z-50 bg-primary text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-primary-dark transition"
      @click.prevent="scrollToTop"
    >
      <i class="fas fa-angle-up" />
    </a>

    <!-- Floating social buttons -->
    <ul class="fixed bottom-10 left-6 z-50 flex flex-col gap-3 list-none p-0 m-0">
      <li>
        <a
          :href="`tel:${settings?.setting?.mobile || ''}`"
          target="_blank"
          class="flex items-center justify-center w-12 h-12 rounded-xl bg-[#e1c469] text-[#063d37] text-xl shadow-lg shadow-black/20 hover:bg-[#f2d98b] hover:-translate-y-1 transition-all duration-300"
        >
          <i class="fa-solid fa-phone-volume" />
        </a>
      </li>
      <li>
        <a
          :href="`https://wa.me/${settings?.setting?.whatsapp || ''}`"
          target="_blank"
          class="flex items-center justify-center w-12 h-12 rounded-xl bg-[#e1c469] text-[#063d37] text-xl shadow-lg shadow-black/20 hover:bg-[#f2d98b] hover:-translate-y-1 transition-all duration-300"
        >
          <i class="fa-brands fa-whatsapp" />
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const config = useRuntimeConfig()
const globalSettings = useGlobalSettings()

const isRtl = computed(() => locale.value === 'ar')
const dir = computed(() => (isRtl.value ? 'rtl' : 'ltr'))
const settings = globalSettings

// Fetch settings on layout mount (once per locale change)
const { data } = await useFetch<any>(
  () => `${config.public.apiBase}/settings?lang=${locale.value}`,
)

watchEffect(() => {
  if (data.value) {
    globalSettings.value = data.value
  }
})

// Back-to-top visibility
const showBackTop = ref(false)
onMounted(() => {
  window.addEventListener('scroll', () => {
    showBackTop.value = window.scrollY > 300
  })

  // Reveal Animation Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
      }
    })
  }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' })

  const observeElements = () => {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    reveals.forEach(el => observer.observe(el))
  }

  // Initial observation
  observeElements()

  // Watch for DOM changes (like Nuxt data fetching)
  const mutationObserver = new MutationObserver(() => {
    observeElements()
  })

  mutationObserver.observe(document.body, { childList: true, subtree: true })

  onUnmounted(() => {
    mutationObserver.disconnect()
    observer.disconnect()
  })
})
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>
