<template>
  <div>
    <Head><Title>{{ $t('gallery_videos') }}</Title></Head>

    <PageHeader :title="$t('gallery_videos')" />

    <section class="py-16 bg-white">
      <div class="page-container">
        <div v-if="data?.videos?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="video in data.videos"
            :key="video.id"
            class="rounded-xl overflow-hidden shadow-sm border border-gray-100 card-hover"
          >
            <div class="aspect-video bg-gray-900 relative">
              <!-- YouTube embed -->
              <iframe
                v-if="isYoutube(video.video_url)"
                :src="embedUrl(video.video_url)"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
              <!-- Thumbnail fallback -->
              <img
                v-else-if="video.image"
                :src="video.image"
                :alt="video.title"
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full flex items-center justify-center text-white">
                <i class="fas fa-play-circle text-5xl opacity-50" />
              </div>
            </div>
            <div v-if="video.title" class="p-4">
              <h3 class="font-semibold text-gray-800">{{ video.title }}</h3>
            </div>
          </div>
        </div>
        <p v-else class="text-center text-gray-400 py-12">{{ $t('no_data') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { locale } = useI18n()

const { data } = await useFetch<any>(
  () => `${config.public.apiBase}/gallery-videos?lang=${locale.value}`,
)

const isYoutube = (url: string | null) =>
  !!url && (url.includes('youtube.com') || url.includes('youtu.be'))

const embedUrl = (url: string | null) => {
  if (!url) return ''
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}
</script>
