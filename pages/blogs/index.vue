<template>
  <div>
    <Head><Title>{{ $t('blogs') }}</Title></Head>

    <PageHeader :title="$t('blogs')" />

    <section class="py-16 bg-white">
      <div class="page-container">
        <!-- Grid -->
        <div v-if="data?.blogs?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <BlogCard v-for="blog in data.blogs" :key="blog.id" :blog="blog" />
        </div>
        <p v-else class="text-center text-gray-400 py-12">{{ $t('no_data') }}</p>

        <!-- Pagination -->
        <div v-if="data?.pagination && data.pagination.last_page > 1" class="flex items-center justify-center gap-2">
          <button
            :disabled="data.pagination.current_page === 1"
            class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            @click="goToPage(data.pagination.current_page - 1)"
          >
            {{ $t('prev_page') }}
          </button>
          <span class="text-sm text-gray-500">
            {{ data.pagination.current_page }} / {{ data.pagination.last_page }}
          </span>
          <button
            :disabled="data.pagination.current_page === data.pagination.last_page"
            class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            @click="goToPage(data.pagination.current_page + 1)"
          >
            {{ $t('next_page') }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { locale } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const page = computed(() => Number(route.query.page) || 1)

const { data, refresh } = await useFetch<any>(
  () => `${config.public.apiProxyBase}/blogs?lang=${locale.value}&page=${page.value}`,
)

watch([locale, page], () => refresh())

const goToPage = (p: number) => {
  router.push({ path: localePath('/blogs'), query: { page: p } })
}
</script>
