<template>
  <div>
    <Head><Title>{{ $t('patient_gallery') }}</Title></Head>

    <PageHeader :title="$t('patient_gallery')" />

    <section class="py-16 bg-white">
      <div class="page-container">
        <div v-if="data?.images?.length" class="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          <div
            v-for="img in data.images"
            :key="img.id"
            class="break-inside-avoid rounded-xl overflow-hidden shadow-sm card-hover"
          >
            <img :src="img.image" :alt="img.alt || $t('patient_gallery')" class="w-full object-cover">
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
  () => `${config.public.apiProxyBase}/patient-gallery?lang=${locale.value}`,
)
</script>
