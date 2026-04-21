<template>
  <div>
    <Head><Title>{{ $t('services') }}</Title></Head>

    <PageHeader :title="$t('services')" />

    <section class="py-16 bg-white">
      <div class="page-container">
        <div v-if="data?.services?.length" class="space-y-20">
          <div
            v-for="(service, index) in data.services"
            :key="service.id"
            class="flex flex-col gap-8"
            :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
          >
            <div class="md:w-1/2">
              <img
                v-if="service.img"
                :src="service.img"
                :alt="service.alt_image || service.name"
                class="w-full rounded-xl shadow-md object-cover aspect-video"
              >
            </div>
            <div class="md:w-1/2 flex flex-col justify-center">
              <p class="section-subtitle">{{ service.name }}</p>
              <p class="text-gray-600 leading-relaxed mb-6">{{ service.short_text }}</p>
              <NuxtLink :to="localePath(`/service/${service.link}`)" class="btn-primary self-start">
                {{ $t('read_more') }} <i :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'" class="fas ms-2 text-sm" />
              </NuxtLink>
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
const localePath = useLocalePath()
const isRtl = computed(() => locale.value === 'ar')

const { data } = await useFetch<any>(
  () => `${config.public.apiProxyBase}/services?lang=${locale.value}`,
)
</script>
