<template>
  <div>
    <Head><Title>404 - {{ $t('page_not_found') }}</Title></Head>
    <div class="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p class="text-9xl font-black text-gray-100">404</p>
      <h1 class="text-3xl font-bold text-gray-800 -mt-8 mb-4">{{ $t('page_not_found') }}</h1>
      <NuxtLink :to="localePath('/')" class="btn-primary">
        {{ $t('back_home') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
