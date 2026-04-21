<template>
  <footer class="bg-[#034a41] text-white">
    <!-- Main footer -->
    <div class="page-container py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Logo & description -->
        <div>
          <NuxtLink :to="localePath('/')">
            <img
              src="/logo.png"
              alt="Oralign Logo"
              class="h-16 w-auto object-contain mb-4 brightness-0 invert"
            >
          </NuxtLink>
          <p v-if="settings?.configration?.footer_text" class="text-gray-400 text-sm leading-relaxed">
            {{ settings.configration.footer_text }}
          </p>
          <!-- Social links -->
          <div class="flex gap-3 mt-4">
            <a
              v-if="settings?.setting?.facebook"
              :href="settings.setting.facebook"
              target="_blank"
              class="social-icon"
            >
              <i class="fab fa-facebook-f" />
            </a>
            <a
              v-if="settings?.setting?.instagram"
              :href="settings.setting.instagram"
              target="_blank"
              class="social-icon"
            >
              <i class="fab fa-instagram" />
            </a>
            <a
              v-if="settings?.setting?.twitter"
              :href="settings.setting.twitter"
              target="_blank"
              class="social-icon"
            >
              <i class="fab fa-x-twitter" />
            </a>
            <a
              v-if="settings?.setting?.youtube"
              :href="settings.setting.youtube"
              target="_blank"
              class="social-icon"
            >
              <i class="fab fa-youtube" />
            </a>
            <a
              v-if="settings?.setting?.tiktok"
              :href="settings.setting.tiktok"
              target="_blank"
              class="social-icon"
            >
              <i class="fab fa-tiktok" />
            </a>
          </div>
        </div>

        <!-- Quick links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">
            {{ $t('quick_links') }}
          </h3>
          <ul class="space-y-2">
            <li v-for="menu in settings?.menus" :key="menu.id">
              <NuxtLink
                :to="menu.type === 'home' ? localePath('/') : localePath(`/${menu.type}`)"
                class="text-gray-400 hover:text-white transition text-sm"
              >
                {{ menu.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact info -->
        <div>
          <h3 class="text-lg font-semibold mb-4">
            {{ $t('contact_info') }}
          </h3>
          <ul class="space-y-3">
            <li v-for="address in settings?.addresses" :key="address.address" class="flex items-start gap-2 text-gray-400 text-sm">
              <i class="fa-solid fa-location-dot mt-1 text-primary" />
              <a v-if="address.share_map_url" :href="address.share_map_url" target="_blank" class="hover:text-white transition">
                {{ address.address }}
              </a>
              <span v-else>{{ address.address }}</span>
            </li>
            <li v-if="settings?.setting?.mobile" class="flex items-center gap-2 text-gray-400 text-sm">
              <i class="fa-solid fa-phone text-primary" />
              <a :href="`tel:${settings.setting.mobile}`" class="hover:text-white transition">
                {{ settings.setting.mobile }}
              </a>
            </li>
            <li v-if="settings?.setting?.contact_email" class="flex items-center gap-2 text-gray-400 text-sm">
              <i class="fa-solid fa-envelope text-primary" />
              <a :href="`mailto:${settings.setting.contact_email}`" class="hover:text-white transition">
                {{ settings.setting.contact_email }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-gray-800">
      <div class="page-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
        <p>{{ settings?.configration?.copy_rights_text || `© ${new Date().getFullYear()} ${$t('all_rights_reserved')}` }}</p>
        <p>{{ $t('developed_by') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { GlobalSettings } from '~/composables/useGlobalSettings'

defineProps<{ settings: GlobalSettings | null }>()

const localePath = useLocalePath()
</script>

<style scoped>
.social-icon {
  @apply flex items-center justify-center w-9 h-9 rounded-full bg-gray-700 text-gray-300 hover:bg-primary hover:text-white transition text-sm;
}
</style>
