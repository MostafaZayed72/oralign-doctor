<template>
  <NuxtLink :to="blogPath" class="group block card-hover">
    <div class="bg-white dark:bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 dark:border-white/5 transition-all duration-500 reveal h-full flex flex-col">
      <!-- Image -->
      <div class="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
        <img
          v-if="blog.image"
          :src="blog.image"
          :alt="blog.alt_img || blog.name"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          @error="(e: any) => e.target.src = '/aligner-pro.png'"
        >
        <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
          <i class="fas fa-image text-4xl" />
        </div>
      </div>
      <!-- Content -->
      <div class="p-6 flex flex-col flex-1">
        <h3 class="font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-primary dark:group-hover:text-[#e1c469] transition text-lg">
          {{ blog.name }}
        </h3>
        <p class="text-gray-500 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-6">
          {{ blog.text }}
        </p>
        <div class="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
          <span class="text-primary dark:text-[#e1c469] font-bold text-base flex items-center gap-2">
            {{ $t('read_more') }}
            <i :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'" class="fas text-xs transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  blog: {
    id: number
    name: string
    text: string
    image: string | null
    alt_img?: string | null
    link: string
    link_en: string
    link_ar: string
  }
}>()

const { locale } = useI18n()
const localePath = useLocalePath()
const isRtl = computed(() => locale.value === 'ar')
const blogPath = computed(() => localePath(`/blog/${props.blog.link}`))
</script>
