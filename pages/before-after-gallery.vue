<template>
  <div>
    <Head><Title>{{ $t('before_after') }}</Title></Head>

    <PageHeader :title="$t('before_after')" />

    <section class="py-16 bg-white">
      <div class="page-container">
        <div v-if="data?.images?.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="img in data.images"
            :key="img.id"
            class="aspect-square rounded-xl overflow-hidden shadow-sm card-hover"
          >
            <img :src="img.image" :alt="img.alt || $t('before_after')" class="w-full h-full object-cover">
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
  () => `${config.public.apiBase}/before-after-gallery?lang=${locale.value}`,
)
</script>
