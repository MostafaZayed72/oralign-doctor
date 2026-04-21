<template>
  <section class="relative bg-primary-dark py-16 md:py-24 text-white overflow-hidden">
    <div
      v-if="bgImage"
      class="absolute inset-0 bg-cover bg-center opacity-20"
      :style="{ backgroundImage: `url(${bgImage})` }"
    />
    <div class="relative page-container text-center">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">
        {{ title }}
      </h1>
      <!-- Breadcrumb -->
      <nav class="flex items-center justify-center gap-2 text-sm text-white/80">
        <NuxtLink :to="localePath('/')" class="hover:text-white transition">
          {{ $t('home') }}
        </NuxtLink>
        <i :class="isRtl ? 'fa-solid fa-chevron-left' : 'fa-solid fa-chevron-right'" class="text-xs" />
        <span>{{ title }}</span>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  bgImage?: string
}>()

const localePath = useLocalePath()
const { locale } = useI18n()
const isRtl = computed(() => locale.value === 'ar')
</script>
