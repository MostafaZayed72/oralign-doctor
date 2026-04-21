<template>
  <div>
    <Head><Title>{{ data?.blog?.name }}</Title></Head>

    <PageHeader v-if="data?.blog" :title="data.blog.name" />

    <section class="py-16 bg-white">
      <div class="page-container">
        <div v-if="data?.blog" class="flex flex-col lg:flex-row gap-12">
          <!-- Article -->
          <article class="lg:w-2/3">
            <img
              v-if="data.blog.image"
              :src="data.blog.image"
              :alt="data.blog.alt_img || data.blog.name"
              class="w-full rounded-xl shadow-md object-cover aspect-video mb-8"
            >
            <div class="flex items-center gap-3 text-sm text-gray-400 mb-6">
              <i class="fas fa-calendar-alt" />
              <span>{{ formatDate(data.blog.created_at) }}</span>
            </div>
            <div class="prose max-w-none text-gray-700 leading-relaxed" v-html="data.blog.text" />

            <!-- FAQs -->
            <div v-if="data.faqs?.length" class="mt-12">
              <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('faqs') }}</h2>
              <div class="space-y-4">
                <details
                  v-for="faq in data.faqs"
                  :key="faq.id"
                  class="group border border-gray-200 rounded-xl overflow-hidden"
                >
                  <summary class="flex items-center justify-between px-5 py-4 font-semibold text-gray-700 cursor-pointer list-none hover:bg-gray-50">
                    {{ faq.question }}
                    <i class="fas fa-chevron-down text-xs text-gray-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div class="px-5 py-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    {{ faq.answer }}
                  </div>
                </details>
              </div>
            </div>
          </article>

          <!-- Sidebar -->
          <aside class="lg:w-1/3 space-y-8">
            <!-- Blog categories -->
            <div v-if="data.blogCategories?.length" class="bg-gray-50 rounded-xl p-6">
              <h3 class="font-bold text-gray-800 mb-4">{{ $t('quick_links') }}</h3>
              <ul class="space-y-2">
                <li v-for="cat in data.blogCategories" :key="cat.id">
                  <NuxtLink
                    :to="localePath(`/blogs-category/${cat.link}`)"
                    class="text-sm text-gray-600 hover:text-primary transition flex items-center gap-2"
                  >
                    <i :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'" class="fas text-xs text-primary" />
                    {{ cat.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Related blogs -->
            <div v-if="data.relatedBlogs?.length">
              <h3 class="font-bold text-gray-800 mb-4">{{ $t('view_all') }}</h3>
              <div class="space-y-4">
                <NuxtLink
                  v-for="b in data.relatedBlogs"
                  :key="b.id"
                  :to="localePath(`/blog/${b.link}`)"
                  class="flex gap-3 items-start group"
                >
                  <img
                    v-if="b.image"
                    :src="b.image"
                    :alt="b.name"
                    class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  >
                  <p class="text-sm text-gray-600 group-hover:text-primary transition line-clamp-2">
                    {{ b.name }}
                  </p>
                </NuxtLink>
              </div>
            </div>

            <!-- Related services -->
            <div v-if="data.services?.length" class="bg-gray-50 rounded-xl p-6">
              <h3 class="font-bold text-gray-800 mb-4">{{ $t('related_services') }}</h3>
              <ul class="space-y-2">
                <li v-for="srv in data.services" :key="srv.id">
                  <NuxtLink
                    :to="localePath(`/service/${srv.link}`)"
                    class="text-sm text-gray-600 hover:text-primary transition flex items-center gap-2"
                  >
                    <i :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'" class="fas text-xs text-primary" />
                    {{ srv.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </aside>
        </div>
        <p v-else class="text-center text-gray-400 py-12">{{ $t('no_data') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const { locale } = useI18n()
const localePath = useLocalePath()
const isRtl = computed(() => locale.value === 'ar')

const { data } = await useFetch<any>(
  () => `${config.public.apiBase}/blog/${route.params.link}?lang=${locale.value}`,
)

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(locale.value === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
