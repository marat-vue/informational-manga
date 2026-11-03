<script setup>
import AppIcon from '../components/AppIcon.vue'
import { chapters, imagePath } from '../data/chapters'
import { useReaderStore } from '../stores/reader'
const store = useReaderStore()
</script>

<template>
  <div class="shell inner-page about-page">
    <div class="breadcrumbs"><RouterLink to="/">Главная</RouterLink><AppIcon name="right" :size="13" /><span>О манге</span></div>
    <section class="about-hero"><div><span class="eyebrow"><span class="text-accent">ЗА КАДРОМ ИСТОРИИ</span> / ABOUT</span><h1>Технологии.<br />Дружба.<br /><span>И немного будущего.</span></h1><p>«Информационный мир» — авторская образовательная манга о том, как жить в цифровой реальности, понимать её и чувствовать себя увереннее.</p><RouterLink :to="store.continueTo" class="button button-primary"><AppIcon name="book" :size="18" />{{ store.last ? 'Продолжить историю' : 'Открыть первую главу' }}<AppIcon name="arrowUpRight" :size="18" /></RouterLink></div><div class="about-hero-art"><img :src="imagePath('wallpaper.jpg')" alt="Героиня встречает своего друга Робо" /><span lang="ja">情報の世界</span><span class="about-art-sticker">A STORY<br />WORTH<br /><b>EXPLORING.</b></span></div></section>
    <section class="story-section"><span class="eyebrow"><span class="text-accent">01 /</span> СЮЖЕТ</span><div><h2>По ту сторону привычного</h2><p>Ей шестнадцать. Как и у всех нас, её жизнь полна сообщений, экранов и технологий. Но однажды привычный интернет начинает задавать непростые вопросы: кому доверять, что скрывается за ссылкой и как защитить то, что дорого?</p><p>Рядом — Робо, умный и доброжелательный робот. Он объясняет сложные вещи простыми словами и помогает героине замечать то, что раньше оставалось за кадром. Вместе они учатся ориентироваться в мире, который меняется каждый день.</p><p class="story-highlight">Это история о дружбе, любопытстве и знаниях,<br />которые помогают выбирать свой путь.</p></div></section>
    <section class="about-topics"><div class="section-heading"><div><span class="eyebrow"><span class="text-accent">02 /</span> ВНУТРИ ИСТОРИИ</span><h2>О чём мы <span>поговорим</span></h2></div></div><div class="topic-grid"><RouterLink v-for="chapter in chapters" :key="chapter.id" :to="`/chapter/${chapter.id}/page/1`" class="topic-card"><AppIcon :name="chapter.icon" :size="27" /><span>ГЛАВА 0{{ chapter.id }}</span><h3>{{ chapter.title }}</h3><p>{{ chapter.summary }}</p><AppIcon class="topic-arrow" name="arrowUpRight" :size="20" /></RouterLink></div></section>
    <dl class="manga-facts"><div><dt>Формат</dt><dd>Авторская манга</dd></div><div><dt>Жанр</dt><dd>Образование · Приключения</dd></div><div><dt>Первый выпуск</dt><dd>2024</dd></div><div><dt>Объём</dt><dd>4 главы · 42 страницы</dd></div><div><dt>Возраст</dt><dd>12+</dd></div></dl>
  </div>
</template>
