<template>
  <div>
    <Head>
      <Title>{{ $t('home') }}</Title>
    </Head>

    <!-- ═══════════════════════════════════════════ -->
    <!-- HERO - Intro Video Section                  -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="relative overflow-hidden h-[70vh] md:h-screen flex items-center justify-center bg-[#034a41]">
      <video
        class="absolute inset-0 w-full h-full object-cover opacity-70"
        muted
        loop
        playsinline
        autoplay
      >
        <source src="https://doctors.oralign.co/resources/assets/front/intro.mp4" type="video/mp4">
      </video>
      <div class="relative z-10 text-center px-4 w-full max-w-5xl mx-auto flex flex-col items-center">
        <img
          src="/logo.png"
          alt="Oralign Logo"
          class="w-full max-w-[280px] sm:max-w-[420px] md:max-w-[560px] lg:max-w-[680px] h-auto object-contain brightness-0 invert drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-8 reveal"
        >
        <div class="h-1 w-24 bg-[#e1c469] rounded-full mb-8 reveal delay-200"></div>
        <p class="text-white/90 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md reveal delay-300">
          {{ isRtl ? 'شريكك الأمثل في رحلة الابتسامة المثالية مع تقنية التقويم الشفاف الأكثر تطوراً.' : 'Your ultimate partner in the journey to a perfect smile with the most advanced clear aligner technology.' }}
        </p>
      </div>
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50">
        <i class="fa-solid fa-chevron-down text-2xl"></i>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SERVICES - Static Content                   -->
    <!-- ═══════════════════════════════════════════ -->
    <section
      v-for="(service, index) in services"
      :key="index"
      class="py-32 relative overflow-hidden bg-cover bg-center bg-fixed"
      :style="{ backgroundImage: `url(${service.bg})` }"
    >
      <div class="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-sm"></div>
      <div class="absolute inset-0 pointer-events-none">
        <div 
          class="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 dark:opacity-15"
          :class="index % 2 === 0 ? 'top-[-10%] right-[-10%] bg-primary' : 'bottom-[-10%] left-[-10%] bg-[#e1c469]'"
        ></div>
      </div>

      <div class="page-container relative z-10">
        <div
          class="flex flex-col gap-16 items-center p-8 md:p-12 rounded-[3rem] border border-white/20 dark:border-white/5 backdrop-blur-md bg-white/30 dark:bg-white/5 shadow-2xl"
          :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
        >
          <div class="md:w-1/2 w-full" :class="index % 2 === 0 ? 'reveal-left' : 'reveal-right'">
            <div class="relative group">
              <div class="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <img
                :src="service.img"
                :alt="service.title[locale] || service.title.en"
                class="relative w-full rounded-[2rem] shadow-2xl object-cover aspect-[4/3] transform transition-all duration-1000 group-hover:scale-105"
              >
            </div>
          </div>
          <div class="md:w-1/2 w-full flex flex-col justify-center">
            <h2 class="text-2xl md:text-3xl font-bold text-[#034a41] dark:text-[#e1c469] mb-6 reveal delay-100">
              {{ service.title[locale] || service.title.en }}
            </h2>
            <div class="h-1.5 w-16 bg-primary mb-8 rounded-full reveal delay-200"></div>
            <p class="text-gray-700 dark:text-gray-200 text-xl leading-relaxed mb-10 reveal delay-300">
              {{ service.desc[locale] || service.desc.en }}
            </p>
            <NuxtLink :to="localePath('/become-doctor')" class="group inline-flex items-center gap-4 bg-[#034a41] dark:bg-[#e1c469] text-white dark:text-[#034a41] self-start px-10 py-5 rounded-2xl shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-500 reveal delay-500">
              <span class="font-bold text-lg">{{ $t('become_doctor') }}</span>
              <i :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'" class="fas transition-transform group-hover:translate-x-2" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- STATS - Animated Counters                   -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="py-24 bg-[#034a41] dark:bg-[#0a0a0a] relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 top-[-20%] left-[10%] bg-[#e1c469]"></div>
        <div class="absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-20 bottom-[-20%] right-[10%] bg-primary"></div>
      </div>
      <div class="page-container relative z-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div
            v-for="(stat, idx) in stats"
            :key="idx"
            class="text-center reveal"
            :style="{ transitionDelay: `${idx * 150}ms` }"
          >
            <div class="text-6xl md:text-8xl font-black text-[#e1c469] mb-4 tracking-tighter">
              <AnimatedCounter :value="stat.value" />
            </div>
            <div class="h-1 w-10 bg-white/30 mx-auto rounded-full mb-3"></div>
            <p class="text-white/80 text-lg font-medium">{{ stat.label[locale] || stat.label.en }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- FEATURES - Doctor Support 360° Cards        -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="py-28 bg-white dark:bg-[#121212] relative overflow-hidden">
      <div class="page-container relative z-10">
        <div class="text-center mb-16">
          <p class="section-subtitle !text-[#e1c469] reveal">{{ isRtl ? 'لماذا أورالاين؟' : 'Why Oralign?' }}</p>
          <h2 class="text-4xl font-bold text-[#034a41] dark:text-white reveal delay-200">
            {{ isRtl ? 'دعم الطبيب 360°' : 'Doctor Support 360°' }}
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(feature, idx) in features"
            :key="idx"
            class="group flex flex-col items-center text-center p-8 rounded-[2rem] bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-white/5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 min-h-[350px] reveal"
            :style="{ transitionDelay: `${idx * 150}ms` }"
          >
            <div class="w-24 h-24 mb-8 flex items-center justify-center rounded-2xl bg-[#034a41]/10 dark:bg-[#e1c469]/10 group-hover:scale-110 transition-transform duration-500">
              <i :class="feature.icon" class="text-4xl text-[#034a41] dark:text-[#e1c469]"></i>
            </div>
            <h3 class="font-bold text-xl text-[#034a41] dark:text-[#e1c469] mb-4">
              {{ feature.title[locale] || feature.title.en }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              {{ feature.desc[locale] || feature.desc.en }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- HOW IT WORKS - Process Steps                -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="py-28 bg-gray-50 dark:bg-[#181818] relative overflow-hidden">
      <div class="page-container relative z-10">
        <div class="text-center mb-16">
          <p class="section-subtitle !text-[#e1c469] reveal">{{ isRtl ? 'خطوات بسيطة' : 'Simple Steps' }}</p>
          <h2 class="text-4xl font-bold text-[#034a41] dark:text-white reveal delay-200">
            {{ isRtl ? 'كيف يعمل التقويم الشفاف؟' : 'How Does Clear Aligner Work?' }}
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div
            v-for="(step, idx) in steps"
            :key="idx"
            class="relative text-center reveal"
            :style="{ transitionDelay: `${idx * 200}ms` }"
          >
            <!-- Connector line -->
            <div v-if="idx < steps.length - 1" class="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#034a41] to-[#e1c469] dark:from-[#e1c469] dark:to-[#034a41] opacity-30"></div>
            
            <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-[#034a41] dark:bg-[#e1c469] flex items-center justify-center shadow-xl">
              <span class="text-3xl font-black text-white dark:text-[#034a41]">{{ idx + 1 }}</span>
            </div>
            <h3 class="font-bold text-xl text-[#034a41] dark:text-[#e1c469] mb-3">
              {{ step.title[locale] || step.title.en }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-xs mx-auto">
              {{ step.desc[locale] || step.desc.en }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- CTA - Call to Action Banner                 -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="py-24 relative overflow-hidden bg-cover bg-center bg-fixed" style="background-image: url('/dental-bg.png')">
      <div class="absolute inset-0 bg-[#034a41]/85 dark:bg-black/80 backdrop-blur-sm"></div>
      <div class="page-container relative z-10 text-center">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-8 reveal">
          {{ isRtl ? 'ابدأ رحلتك مع أورالاين اليوم' : 'Start Your Journey with Oralign Today' }}
        </h2>
        <p class="text-white/80 text-xl max-w-3xl mx-auto mb-12 leading-relaxed reveal delay-200">
          {{ isRtl ? 'انضم إلى شبكة من أفضل أطباء الأسنان حول العالم واحصل على الدعم الكامل لتقديم أفضل رعاية لمرضاك مع أحدث تقنيات التقويم الشفاف.' : 'Join a network of the best dentists worldwide and get full support to provide the best care for your patients with the latest clear aligner technology.' }}
        </p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center reveal delay-300">
          <NuxtLink :to="localePath('/become-doctor')" class="group inline-flex items-center gap-4 bg-[#e1c469] text-[#034a41] px-12 py-5 rounded-2xl shadow-xl hover:shadow-[#e1c469]/30 hover:-translate-y-1 transition-all duration-500">
            <span class="font-bold text-xl">{{ $t('become_doctor') }}</span>
            <i :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'" class="fas transition-transform group-hover:translate-x-2" />
          </NuxtLink>
          <NuxtLink :to="localePath('/login')" class="group inline-flex items-center gap-4 border-2 border-white/40 text-white px-12 py-5 rounded-2xl hover:bg-white/10 transition-all duration-500">
            <span class="font-bold text-xl">{{ $t('login') }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- BLOGS - Dynamic from API                    -->
    <!-- ═══════════════════════════════════════════ -->
    <section v-if="blogs?.length" class="py-24 bg-white dark:bg-[#121212]">
      <div class="page-container">
        <div class="text-center mb-16">
          <p class="section-subtitle !text-[#e1c469] reveal">{{ $t('latest_blogs') }}</p>
          <h2 class="text-4xl font-bold text-gray-800 dark:text-white reveal delay-200">{{ $t('blogs') }}</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogCard v-for="(blog, idx) in blogs" :key="blog.id" :blog="blog" :style="{ transitionDelay: `${idx * 150}ms` }" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { locale } = useI18n()
const localePath = useLocalePath()
const isRtl = computed(() => locale.value === 'ar')

// ─── Static Services Data ────────────────────────────────
const services = [
  {
    title: {
      ar: 'شريكك الأمثل في تقويم الأسنان الشفاف',
      en: 'Your Clear Aligner Partner of Choice'
    },
    desc: {
      ar: 'نحرص على تقديم أفضل الدعم السريري والتجاري لنضعك في قمة مهنتك. انضم إلى شبكة أطبائنا المعتمدين واستفد من أحدث تقنيات التقويم الشفاف المتطورة.',
      en: 'We prioritize offering best-in-class clinical and commercial support to put you at the top of your profession. Join our certified doctors network and benefit from the most advanced clear aligner technology.'
    },
    img: '/aligner-closeup.png',
    bg: '/dental-bg.png'
  },
  {
    title: {
      ar: 'تقنية متقدمة لنتائج استثنائية',
      en: 'Advanced Technology for Exceptional Results'
    },
    desc: {
      ar: 'نستخدم أحدث تقنيات التصوير ثلاثي الأبعاد والذكاء الاصطناعي لتصميم خطة علاجية مثالية لكل حالة. قوالبنا الشفافة مصنوعة من مواد طبية فائقة الجودة لضمان أفضل النتائج.',
      en: 'We use the latest 3D imaging and AI technology to design the perfect treatment plan for each case. Our clear aligners are made from premium medical-grade materials to ensure the best outcomes.'
    },
    img: '/dentist-male.png',
    bg: '/dental-bg-2.png'
  }
]

// ─── Stats Data ──────────────────────────────────────────
const stats = [
  { value: '5000+', label: { ar: 'طبيب معتمد', en: 'Certified Doctors' } },
  { value: '50K+', label: { ar: 'حالة ناجحة', en: 'Successful Cases' } },
  { value: '25+', label: { ar: 'دولة حول العالم', en: 'Countries Worldwide' } },
  { value: '98%', label: { ar: 'رضا المرضى', en: 'Patient Satisfaction' } }
]

// ─── Static Features Data ────────────────────────────────
const features = [
  {
    icon: 'fas fa-headset',
    title: { ar: 'دعم فني متواصل', en: 'Continuous Technical Support' },
    desc: {
      ar: 'نحن دائماً بجانبك. طوال الوقت نوفر لك الدعم العلمي والتقني المطلوب في أسرع وقت ممكن.',
      en: 'We are always by your side. We provide the scientific and technical support you need as fast as possible.'
    }
  },
  {
    icon: 'fas fa-flask',
    title: { ar: 'أحدث الأبحاث العلمية', en: 'Latest Scientific Research' },
    desc: {
      ar: 'نواكب في صناعتنا أحدث الأبحاث العلمية الموثوقة في مجال القوالب الشفافة للوصول إلى أعلى جودة ممكنة.',
      en: 'We keep up with the latest trusted scientific research in clear aligners to achieve the highest possible quality.'
    }
  },
  {
    icon: 'fas fa-teeth',
    title: { ar: 'لصقات مخصصة بدقة', en: 'Precision Custom Attachments' },
    desc: {
      ar: 'اللصقات تستخدم لتعزيز حركة الأسنان، وبإمكانك أن تختار الشكل والحجم المناسب لخطة علاج حالاتك ونحن ننفذها بكل دقة.',
      en: 'Attachments are used to enhance tooth movement. You can choose the right shape and size, and we execute it with precision.'
    }
  },
  {
    icon: 'fas fa-exchange-alt',
    title: { ar: 'بدائل سريعة للقوالب', en: 'Quick Aligner Replacements' },
    desc: {
      ar: 'اطلب بدلاً للقالب المفقود. سنوفر البديل لك في أسرع وقت إذا فقد مريضك أحد القوالب الشفافة.',
      en: 'Request a replacement for a lost aligner. We provide the replacement ASAP if your patient loses a clear aligner.'
    }
  },
  {
    icon: 'fas fa-tools',
    title: { ar: 'تعديلات مرنة', en: 'Flexible Modifications' },
    desc: {
      ar: 'هناك حاجة إلى التعديلات أحياناً! نوفر لك المرونة الكاملة لتعديل خطط العلاج وتحسين النتائج بدون تأخير.',
      en: 'Sometimes modifications are needed! We offer full flexibility to adjust treatment plans and improve results without delay.'
    }
  },
  {
    icon: 'fas fa-shipping-fast',
    title: { ar: 'سرعة في التوصيل', en: 'Fast Delivery' },
    desc: {
      ar: 'نلتزم بتوصيل القوالب الشفافة في أسرع وقت ممكن لضمان استمرارية العلاج دون انقطاع لمرضاك.',
      en: 'We are committed to delivering clear aligners as fast as possible to ensure uninterrupted treatment for your patients.'
    }
  }
]

// ─── How It Works Steps ──────────────────────────────────
const steps = [
  {
    title: { ar: 'فحص المريض', en: 'Patient Examination' },
    desc: { ar: 'قم بفحص المريض وتقييم حالته لتحديد مدى ملاءمة التقويم الشفاف لعلاجه.', en: 'Examine the patient and assess their condition to determine clear aligner suitability.' }
  },
  {
    title: { ar: 'إرسال البيانات', en: 'Submit Data' },
    desc: { ar: 'أرسل الطبعات أو المسح ثلاثي الأبعاد مع صور المريض عبر منصتنا الإلكترونية.', en: 'Submit impressions or 3D scans along with patient photos through our online platform.' }
  },
  {
    title: { ar: 'خطة العلاج', en: 'Treatment Plan' },
    desc: { ar: 'فريقنا يصمم خطة علاج ثلاثية الأبعاد مخصصة لك لمراجعتها والموافقة عليها.', en: 'Our team designs a custom 3D treatment plan for your review and approval.' }
  },
  {
    title: { ar: 'استلام القوالب', en: 'Receive Aligners' },
    desc: { ar: 'استلم القوالب الشفافة المصنعة بدقة عالية وابدأ رحلة العلاج مع مريضك.', en: 'Receive precision-manufactured clear aligners and begin the treatment journey with your patient.' }
  }
]

// ─── Dynamic Blogs from API ──────────────────────────────
const fixUrl = (url: string) => {
  if (!url) return ''
  return url.replace(/https?:\/\/127\.0\.0\.1:8000/g, 'https://doctors.oralign.co')
    .replace(/https?:\/\/localhost:8000/g, 'https://doctors.oralign.co')
}

// Ensure apiBase ends without slash then add it if needed
const apiEndpoint = computed(() => {
  const base = config.public.apiBase || 'https://doctors.oralign.co/api/website'
  return `${base.replace(/\/$/, '')}/home?lang=${locale.value}`
})

const { data: rawData, error } = await useFetch<any>(apiEndpoint, {
  key: `home-data-${locale.value}`,
  server: true,
  lazy: false
})

if (error.value) {
  console.error('Fetch error:', error.value)
}

const blogs = computed(() => {
  const list = rawData.value?.blogs || []
  return list.map((b: any) => ({
    ...b,
    image: fixUrl(b.image)
  }))
})
</script>
