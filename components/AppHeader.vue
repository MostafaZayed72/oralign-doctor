<template>
  <div class="sticky top-0 z-50">
    <header
      class="transition-all duration-300"
      :class="scrolled
        ? 'bg-[#04564f]/95 dark:bg-[#022c28]/95 backdrop-blur-lg shadow-[0_8px_28px_rgba(0,0,0,0.35)]'
        : 'bg-[#04564f] dark:bg-[#022c28] border-b border-[#d6b25c]/30'"
    >
      <div class="page-container">
        <div class="flex items-center h-[68px] lg:h-[84px] gap-4">

          <!-- MOBILE BURGER BUTTON -->
          <button
            class="lg:hidden inline-flex items-center justify-center p-2.5 rounded-full text-[15px] text-[#f2d98b] hover:bg-[#d6b25c]/15 transition-all duration-200"
            :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
            type="button"
            @click="mobileOpen = !mobileOpen"
          >
            <Transition name="icon-swap" mode="out-in">
              <i v-if="mobileOpen" key="x" class="fas fa-times text-[17px] text-[#f2d98b]" />
              <i v-else key="bars" class="fas fa-bars text-[17px] text-[#f2d98b]" />
            </Transition>
          </button>

          <NuxtLink :to="localePath('/')" class="flex items-center flex-shrink-0 group" aria-label="Home">
            <img
              v-if="!showLogoText"
              :src="logoSrc"
              alt="Oralign Logo"
              class="block h-8 lg:h-10 w-auto object-contain translate-y-1.5 lg:translate-y-2 transition-all duration-200 group-hover:opacity-80"
              @error="onLogoError"
            >
            <span v-else class="text-xl font-black text-[#e1c469] tracking-widest leading-none translate-y-0.5">ORALIGN</span>
          </NuxtLink>

          <nav class="hidden lg:flex items-center flex-1 justify-start gap-1.5 ms-6">
            <template v-for="menu in navItems" :key="menu.id">

              <div v-if="menu.sub_menus?.length" class="relative group/dd">
                <button class="nav-link flex items-center gap-1.5">
                  {{ menu.name }}
                  <i class="fas fa-chevron-down text-[9px] text-[#d6b25c]/80 transition-transform duration-200 group-hover/dd:rotate-180" />
                </button>
                <div class="dropdown-panel">
                  <NuxtLink
                    v-for="sub in menu.sub_menus"
                    :key="sub.id"
                    :to="localePath(`/${sub.type}`)"
                    class="dropdown-item"
                  >
                    <span class="dropdown-dot" />
                    {{ sub.name }}
                  </NuxtLink>
                </div>
              </div>

              <NuxtLink
                v-else
                :to="localePath(`/${menu.type}`)"
                class="nav-link"
                active-class="nav-link--active"
              >{{ menu.name }}</NuxtLink>

            </template>
          </nav>

          <div class="flex items-center gap-1.5 flex-shrink-0 ms-auto lg:ms-0">

            <a
              href="https://oralign.co"
              target="_blank"
              rel="noopener noreferrer"
              class="hidden xl:inline-flex items-center gap-1.5 border border-[#d6b25c] text-[#f2d98b] hover:bg-[#d6b25c] hover:text-[#063d37] text-[13px] font-bold px-4 py-2 rounded-full transition-all duration-200"
            >
              {{ $t('patient_website') }}
            </a>

            <template v-if="!isAuthenticated">
              <NuxtLink
                :to="localePath('/become-doctor')"
                class="hidden xl:inline-flex items-center gap-1.5 bg-[#034a41] text-white hover:bg-[#02332c] text-[13px] font-bold px-4 py-2 rounded-md transition-all duration-200"
              >
                انضم إلينا كطبيب
              </NuxtLink>
              <NuxtLink
                :to="localePath('/login')"
                class="hidden lg:inline-flex items-center gap-2 bg-[#d6b25c] text-[#063d37] hover:bg-[#f2d98b] text-[13px] font-bold px-5 py-2 rounded-full transition-all duration-200 shadow-lg shadow-black/20"
              >
                <i class="fas fa-key text-[11px]" />
                {{ $t('login') }}
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink
                :to="localePath('/dashboard')"
                class="hidden lg:inline-flex items-center gap-2 bg-[#d6b25c] text-[#063d37] hover:bg-[#f2d98b] text-[13px] font-bold px-5 py-2 rounded-full transition-all duration-200 shadow-lg shadow-black/20"
              >
                <i class="fas fa-columns text-[11px]" />
                لوحة التحكم
              </NuxtLink>
              <button
                @click="logout"
                class="hidden xl:inline-flex items-center gap-1.5 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white text-[13px] font-bold px-4 py-2 rounded-full transition-all duration-200"
              >
                <i class="fas fa-sign-out-alt text-[11px]" />
              </button>
            </template>

            <button
              class="icon-btn group/dm"
              :title="isDark ? $t('light_mode') : $t('dark_mode')"
              type="button"
              @click="toggleColorMode"
            >
              <Transition name="icon-swap" mode="out-in">
                <span v-if="isDark" key="sun">
                  <i class="fas fa-sun text-[#f2d98b] group-hover/dm:text-[#ffe8a0] transition-colors" />
                </span>
                <span v-else key="moon">
                  <i class="fas fa-moon text-[#f2d98b] group-hover/dm:text-[#ffe8a0] transition-colors" />
                </span>
              </Transition>
            </button>

            <button
              type="button"
              class="lang-btn"
              @click="switchLocale"
            >
              {{ locale === 'ar' ? 'EN' : 'AR' }}
            </button>

          </div>
        </div>
      </div>
    </header>

    <!-- ── MOBILE MENU ── -->
    <Transition name="mobile-slide">
      <div
        v-if="mobileOpen"
        class="lg:hidden bg-[#04564f] dark:bg-[#022c28] border-b border-[#d6b25c]/30 shadow-xl"
      >
        <div class="page-container py-3 max-h-[76vh] overflow-y-auto">
          <nav class="space-y-0.5 mb-4">
            <template v-for="menu in navItems" :key="menu.id">

              <NuxtLink
                v-if="!menu.sub_menus?.length"
                :to="localePath(`/${menu.type}`)"
                class="mobile-link"
                @click="mobileOpen = false"
              >
                <span>{{ menu.name }}</span>
              </NuxtLink>

              <details v-else class="group/acc">
                <summary class="mobile-link cursor-pointer list-none">
                  <span class="flex-1">{{ menu.name }}</span>
                  <i class="fas fa-chevron-down text-[10px] text-[#d6b25c]/80 transition-transform duration-200 group-open/acc:rotate-180" />
                </summary>
                <div class="ps-10 pt-1 pb-1 space-y-0.5">
                  <NuxtLink
                    v-for="sub in menu.sub_menus"
                    :key="sub.id"
                    :to="localePath(`/${sub.type}`)"
                    class="mobile-link text-[13px] py-2.5"
                    @click="mobileOpen = false"
                  >
                    <span class="dropdown-dot me-2" />{{ sub.name }}
                  </NuxtLink>
                </div>
              </details>

            </template>
          </nav>

          <div class="border-t border-[#d6b25c]/25 pt-4 pb-2 space-y-2.5">
            <template v-if="!isAuthenticated">
              <NuxtLink
                :to="localePath('/login')"
                class="flex items-center justify-center gap-2 w-full bg-[#d6b25c] text-[#063d37] hover:bg-[#f2d98b] text-sm font-bold px-4 py-3 rounded-xl transition-colors duration-200"
                @click="mobileOpen = false"
              >
                <i class="fas fa-key text-[11px]" />
                {{ $t('login') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/become-doctor')"
                class="flex items-center justify-center gap-2 w-full bg-[#034a41] text-white hover:bg-[#02332c] text-sm font-bold px-4 py-3 rounded-lg transition-colors duration-200"
                @click="mobileOpen = false"
              >
                انضم إلينا كطبيب
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink
                :to="localePath('/dashboard')"
                class="flex items-center justify-center gap-2 w-full bg-[#d6b25c] text-[#063d37] hover:bg-[#f2d98b] text-sm font-bold px-4 py-3 rounded-xl transition-colors duration-200"
                @click="mobileOpen = false"
              >
                <i class="fas fa-columns text-[11px]" />
                لوحة التحكم
              </NuxtLink>
              <button
                @click="() => { logout(); mobileOpen = false }"
                class="flex items-center justify-center gap-2 w-full border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white text-sm font-bold px-4 py-3 rounded-xl transition-colors duration-200"
              >
                <i class="fas fa-sign-out-alt text-[11px]" />
                تسجيل الخروج
              </button>
            </template>
            <a
              href="https://oralign.co"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 w-full border border-[#d6b25c] text-[#f2d98b] hover:bg-[#d6b25c] hover:text-[#063d37] text-sm font-bold px-4 py-3 rounded-xl transition-colors duration-200"
              @click="mobileOpen = false"
            >
              {{ $t('patient_website') }}
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const { isAuthenticated, logout } = useAuth()

const navItems = computed(() => [
  { id: 1, type: 'about-us',              name: t('about_oralign'),           sub_menus: [] },
  { id: 2, type: 'case-studies',          name: t('cases'),                   sub_menus: [] },
  { id: 3, type: 'packages',              name: t('treatment_packages'),      sub_menus: [] },
  { id: 4, type: 'faqs',                  name: t('most_common_questions'),   sub_menus: [] },
  {
    id: 5, type: 'media', name: t('media'),
    sub_menus: [
      { id: 51, type: 'patient-gallery',       name: t('patient_gallery') },
      { id: 52, type: 'before-after-gallery',  name: t('before_after') },
      { id: 53, type: 'gallery-videos',        name: t('gallery_videos') },
    ],
  },
  { id: 6, type: 'blogs',                 name: t('articles'),                sub_menus: [] },
])

// ── Color mode ──────────────────────────────────────────────────────────────
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const toggleColorMode = () => {
  const next = isDark.value ? 'light' : 'dark'
  colorMode.preference = next
  colorMode.value = next
}

// ── Scroll shadow ────────────────────────────────────────────────────────────
const scrolled = ref(false)
onMounted(() => {
  const onScroll = () => { scrolled.value = window.scrollY > 12 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

// ── Mobile menu ──────────────────────────────────────────────────────────────
const mobileOpen = ref(false)
watch(() => route.path, () => { mobileOpen.value = false })
onMounted(() => {
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') mobileOpen.value = false }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})

// ── Language switch ──────────────────────────────────────────────────────────
const { setLocale } = useI18n()
const switchLocale = async () => {
  const next = locale.value === 'ar' ? 'en' : 'ar'
  const target = switchLocalePath(next)

  if (target) {
    await navigateTo(target)
    return
  }

  await setLocale(next)
}

// ── Logo ─────────────────────────────────────────────────────────────────────
const logoSrc = '/logo.png'
const showLogoText = ref(false)

const onLogoError = () => {
  showLogoText.value = true
}
</script>

<style scoped>
/* ── Desktop nav link ────────────────────────────────────────────────────── */
.nav-link {
  @apply relative px-2 py-2 text-[13.5px] font-semibold rounded-md
    hover:text-[#f2d98b]
    transition-colors duration-200 whitespace-nowrap cursor-pointer select-none;
  color: #f1f5f9;
}
:global(.dark) .nav-link { color: #f1f5f9; }

/* Animated underline */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, #b39145, #d6b25c, #e8cd82);
  border-radius: 9999px;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav-link:hover::after,
.nav-link--active::after { width: 70%; }
.nav-link--active { color: #f2d98b !important; }

/* ── Dropdown ───────────────────────────────────────────────────────────── */
.dropdown-panel {
  @apply absolute top-full start-0 mt-2 min-w-[210px]
    bg-[#033d38]
    border border-[#d6b25c]/40
    rounded-2xl shadow-2xl shadow-black/40
    py-2 z-50 hidden group-hover/dd:block;
  animation: dd-reveal 0.18s cubic-bezier(0.34, 1.4, 0.64, 1);
  transform-origin: top center;
}
@keyframes dd-reveal {
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    }
}
.dropdown-item {
  @apply flex items-center gap-2.5 px-4 py-2.5 text-[13px]
    text-slate-100
    hover:text-[#f2d98b]
    hover:bg-[#d6b25c]/10
    transition-colors duration-150 whitespace-nowrap;
}
.dropdown-dot {
  @apply inline-flex w-1.5 h-1.5 rounded-full bg-[#d6b25c]/80 flex-shrink-0;
}

/* ── Icon button ─────────────────────────────────────────────────────────── */
.icon-btn {
  @apply inline-flex items-center justify-center p-2.5 rounded-full text-[15px]
    text-[#f2d98b]
    hover:bg-[#d6b25c]/15
    transition-all duration-200;
}

.lang-btn {
  @apply inline-flex items-center justify-center min-w-[40px] h-[34px]
    rounded-full border border-[#d6b25c]
    text-[#f2d98b] text-[12px] font-bold
    hover:bg-[#d6b25c] hover:text-[#063d37]
    transition-all duration-200;
}

/* ── Mobile link ─────────────────────────────────────────────────────────── */
.mobile-link {
  @apply flex items-center w-full px-3 py-3 text-[14px] font-medium
    text-slate-100
    rounded-xl hover:bg-[#d6b25c]/10 hover:text-[#f2d98b]
    transition-colors duration-150;
}

/* ── Transition: icon swap ───────────────────────────────────────────────── */
.icon-swap-enter-active,
.icon-swap-leave-active { transition: all 0.18s ease; }
.icon-swap-enter-from   { opacity: 0; transform: rotate(-20deg) scale(0.65); }
.icon-swap-leave-to     { opacity: 0; transform: rotate(20deg)  scale(0.65); }

/* ── Transition: mobile slide ────────────────────────────────────────────── */
.mobile-slide-enter-active { transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1); }
.mobile-slide-leave-active { transition: all 0.2s  cubic-bezier(0.4, 0, 0.2, 1); }
.mobile-slide-enter-from,
.mobile-slide-leave-to     { opacity: 0; transform: translateY(-10px); }
</style>

