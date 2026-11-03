<script setup>
import { computed, ref } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import ChapterCard from '../components/ChapterCard.vue'
import { chapters } from '../data/chapters'
import { useReaderStore } from '../stores/reader'
const store = useReaderStore()
const filter = ref('all')
const query = ref('')
const sort = ref('asc')
const tabs = [{ id: 'all', title: 'Все главы' }, { id: 'reading', title: 'Читаю' }, { id: 'new', title: 'Не прочитано' }, { id: 'complete', title: 'Прочитано' }]
const filtered = computed(() => chapters.filter((chapter) => {
  const progress = store.progress[chapter.id] || 0
  const matches = `${chapter.title} ${chapter.topic} ${chapter.summary}`.toLowerCase().includes(query.value.trim().toLowerCase())
  return matches && (filter.value === 'all' || filter.value === 'reading' && progress > 0 && progress < chapter.pages || filter.value === 'new' && !progress || filter.value === 'complete' && progress === chapter.pages)
}).sort((a, b) => sort.value === 'asc' ? a.id - b.id : b.id - a.id))
</script>

<template>
  <div class="shell inner-page chapters-page">
    <div class="breadcrumbs"><RouterLink to="/">Главная</RouterLink><AppIcon name="right" :size="13" /><span>Главы</span></div>
    <div class="page-intro"><span class="eyebrow"><span class="text-accent">THE INFORMATION WORLD</span> / СОДЕРЖАНИЕ</span><h1>Четыре главы.<br /><span>Целый новый мир.</span></h1><p>Каждая глава — новая история и ещё один шаг<br class="desktop-break" /> к пониманию цифрового мира. Выбирай, с чего начать.</p><span class="page-intro-number" aria-hidden="true">04</span></div>
    <div class="chapter-controls"><div class="filter-tabs" role="group" aria-label="Фильтр глав"><button v-for="tab in tabs" :key="tab.id" :class="{ selected: filter === tab.id }" :aria-pressed="filter === tab.id" @click="filter = tab.id">{{ tab.title }}<span v-if="tab.id === 'all'">4</span></button></div><div class="chapter-tools"><label class="inline-search"><AppIcon name="search" :size="17" /><input v-model="query" aria-label="Найти главу" placeholder="Найти главу…" /></label><button class="icon-button sort-button" :aria-label="sort === 'asc' ? 'Сначала последние главы' : 'Сначала первые главы'" :title="sort === 'asc' ? 'Сначала последние' : 'Сначала первые'" @click="sort = sort === 'asc' ? 'desc' : 'asc'"><AppIcon name="sort" :size="19" /></button></div></div>
    <TransitionGroup v-if="filtered.length" name="cards" tag="div" class="chapter-grid catalog-grid"><ChapterCard v-for="(chapter, index) in filtered" :key="chapter.id" :chapter="chapter" :index="index" /></TransitionGroup>
    <div v-else class="empty-state catalog-empty"><AppIcon :name="query ? 'search' : 'book'" :size="40" /><h2>{{ query ? 'Такой главы пока нет' : 'Здесь пока нет глав' }}</h2><p>{{ query ? 'Попробуй другое название или тему.' : 'Прочитай первую страницу — и история появится здесь.' }}</p><button class="button button-secondary" @click="filter = 'all'; query = ''">Показать все главы <AppIcon name="arrowRight" :size="17" /></button></div>
    <div class="catalog-note"><AppIcon name="info" :size="18" /><p>Читай в своём темпе. Прогресс сохраняется автоматически, а любимые страницы можно добавить в закладки.</p><button class="text-link" @click="store.modal = 'library'">Мой прогресс <AppIcon name="arrowUpRight" :size="17" /></button></div>
  </div>
</template>
