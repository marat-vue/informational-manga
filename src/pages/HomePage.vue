<script setup>
import { computed } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import ChapterCard from '../components/ChapterCard.vue'
import { chapters, imagePath, totalPages } from '../data/chapters'
import { useReaderStore } from '../stores/reader'
const store = useReaderStore()
const lastChapter = computed(() => store.last ? chapters[store.last.chapter - 1] : null)
</script>

<template>
  <div class="home-page">
    <section class="hero shell" aria-labelledby="hero-title">
      <div class="hero-art" aria-hidden="true"><img :src="imagePath('wallpaper.jpg')" alt="" fetchpriority="high" width="1280" height="905" /><div class="hero-art-gradient"></div><div class="hero-grid"></div><span class="art-cross cross-one">+</span><span class="art-cross cross-two">+</span><span class="hero-japanese" lang="ja">情報の世界</span><div class="art-caption"><span class="live-dot"></span> ПО ТУ СТОРОНУ ЭКРАНА <span>VOL. 01 — 04</span></div></div>
      <div class="hero-content">
        <div class="hero-eyebrow"><span class="little-line"></span> НЕ ПРОСТО МАНГА. ТВОЙ ЦИФРОВОЙ МИР.</div>
        <h1 id="hero-title">ИНФОРМАЦИОННЫЙ<br /><span>МИР<span class="title-dot">.</span></span></h1>
        <p class="hero-description">У каждой технологии есть своя история.<br />Открой её вместе с нами — страница за страницей.</p>
        <div class="hero-tags"><span>Приключения</span><i></i><span>Технологии</span><i></i><span>Дружба</span><span class="age-tag">12+</span></div>
        <div class="hero-buttons"><RouterLink :to="store.continueTo" class="button button-primary"><AppIcon name="book" :size="19" />{{ store.last ? 'Продолжить чтение' : 'Начать читать' }}<AppIcon name="arrowUpRight" :size="19" /></RouterLink><RouterLink to="/title" class="hero-about">Об истории <AppIcon name="arrowRight" :size="17" /></RouterLink></div>
        <div class="hero-stats"><span><strong>04</strong> главы</span><span><strong>{{ totalPages }}</strong> страницы</span><span><span class="status-dot"></span> Бесплатно и без регистрации</span></div>
      </div>
      <span class="hero-edition">ОРИГИНАЛЬНАЯ МАНГА / 2024</span>
    </section>

    <div class="world-strip"><div class="shell world-strip-inner"><span>ЧИТАЙ<span class="strip-star">✳</span>ИССЛЕДУЙ<span class="strip-star">✳</span>ЗАЩИЩАЙ<span class="strip-star">✳</span>СВОЙ ЦИФРОВОЙ МИР</span><AppIcon name="arrowUpRight" :size="22" /></div></div>

    <div class="shell home-body">
      <RouterLink :to="store.continueTo" class="reading-banner"><span class="reading-banner-icon"><AppIcon :name="store.last ? 'bookmark' : 'sparkles'" :size="23" /></span><div class="reading-banner-copy"><span class="eyebrow">{{ store.last ? 'ТВОЯ ИСТОРИЯ ПРОДОЛЖАЕТСЯ' : 'ПЕРВОЕ ЗНАКОМСТВО?' }}</span><h2>{{ store.last ? `Возвращайся в «${lastChapter.title}»` : 'Большое путешествие начинается с первой страницы' }}</h2><p>{{ store.last ? `Глава ${store.last.chapter} · Страница ${store.last.page} из ${lastChapter.pages}. Мы сохранили место, на котором ты остановился.` : 'Познакомься с героиней и её другом Робо. Они покажут, как устроен мир по ту сторону экрана.' }}</p></div><span v-if="store.last" class="banner-progress">{{ store.percentage }}<small>%</small></span><span class="banner-arrow"><AppIcon name="arrowRight" :size="21" /></span></RouterLink>

      <section class="chapters-section" aria-labelledby="chapters-heading"><div class="section-heading"><div><span class="eyebrow"><span class="text-accent">01 /</span> ЧЕТЫРЕ ШАГА К НОВОМУ МИРУ</span><h2 id="chapters-heading">Вся история <span>по главам</span><span class="heading-count">04</span></h2></div><RouterLink to="/chapters" class="text-link">Все главы <AppIcon name="arrowUpRight" :size="18" /></RouterLink></div><div class="chapter-grid"><ChapterCard v-for="(chapter, index) in chapters" :key="chapter.id" :chapter="chapter" :index="index" /></div></section>

      <section class="about-teaser"><div class="teaser-art"><img :src="imagePath('wallpaper.jpg')" alt="Героиня манги и её друг Робо" loading="lazy" /><span class="teaser-art-label">HUMAN × TECHNOLOGY</span></div><div class="teaser-content"><span class="eyebrow"><span class="text-accent">02 /</span> ИСТОРИЯ СО СМЫСЛОМ</span><h2>Мир сложнее,<br />чем кажется.<br /><span>Давай разберёмся.</span></h2><p>Шестнадцатилетняя девушка и её друг Робо исследуют цифровую реальность. Пароли, соцсети, технологии будущего — сложные вещи становятся частью одной большой истории.</p><RouterLink to="/title" class="text-link">Больше о манге <AppIcon name="arrowUpRight" :size="18" /></RouterLink></div><span class="teaser-star" aria-hidden="true">✳</span></section>

      <div class="bottom-note"><span class="note-icon"><AppIcon name="shield" :size="19" /></span><p>Знания — твоя суперсила.<span> Читай истории. Замечай детали. Будь в безопасности.</span></p><span class="note-symbol" aria-hidden="true">↗</span></div>
    </div>
  </div>
</template>
