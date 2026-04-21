<template>
  <div>
    <Head><Title>{{ data?.blogCategory?.name || $t('blogs') }}</Title></Head>

    <PageHeader :title="data?.blogCategory?.name || $t('blogs')" />

    <section class="py-16 bg-white">
      <div class="page-container">
        <div v-if="data?.blogs?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard v-for="blog in data.blogs" :key="blog.id" :blog="blog" />
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

const { data } = await useFetch<any>(
  () => `${config.public.apiBase}/blogs-category/${route.params.link}?lang=${locale.value}`,
)
</script>
