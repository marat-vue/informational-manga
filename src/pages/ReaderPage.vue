<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import BrandMark from '../components/BrandMark.vue'
import { chapters, pagePath, readerPath } from '../data/chapters'
import { adjacentPage, validPosition } from '../lib/progress'
import { useReaderStore } from '../stores/reader'
const store = useReaderStore()
const route = useRoute()
const router = useRouter()
const chapterId = computed(() => Number(route.params.chapterId))
const page = computed(() => Number(route.params.pageId))
const chapter = computed(() => chapters[chapterId.value - 1] || chapters[0])
const focus = ref(false)
const loading = ref(true)
const imageError = ref(false)
const retry = ref(0)
const touchStart = ref(null)
const first = computed(() => chapterId.value === 1 && page.value === 1)
const last = computed(() => chapterId.value === 4 && page.value === chapter.value.pages)
const bookmarked = computed(() => store.hasBookmark(chapterId.value, page.value))
watch([chapterId, page], ([id, number]) => {
  if (!validPosition(id, number)) return
  loading.value = true; imageError.value = false
  store.visit(id, number)
  const next = adjacentPage(id, number, 1)
  if (next) { const preload = new Image(); preload.src = pagePath(next.chapter, next.page) }
}, { immediate: true })
function move(direction) {
  const next = adjacentPage(chapterId.value, page.value, direction)
  if (next) router.push(readerPath(next.chapter, next.page))
  else if (direction === 1 && last.value) { store.notify('Спасибо за путешествие по информационному миру!'); router.push('/chapters') }
}
function jump(number) { router.push(readerPath(chapterId.value, Number(number))) }
function keydown(event) {
  if (store.modal || event.ctrlKey || event.metaKey || event.altKey || ['INPUT', 'SELECT', 'TEXTAREA'].includes(event.target.tagName)) return
  if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
  if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
  if (event.key.toLowerCase() === 'b' || event.key.toLowerCase() === 'и') store.toggleBookmark(chapterId.value, page.value)
  if (event.key.toLowerCase() === 'f' || event.key.toLowerCase() === 'а') focus.value = !focus.value
  if (event.key === 'Escape') focus.value = false
}
function touchEnd(event) {
  if (!touchStart.value || event.changedTouches.length !== 1) return
  const dx = event.changedTouches[0].clientX - touchStart.value.x
  const dy = event.changedTouches[0].clientY - touchStart.value.y
  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1)
  touchStart.value = null
}
onMounted(() => window.addEventListener('keydown', keydown))
onUnmounted(() => window.removeEventListener('keydown', keydown))
</script>

<template>
  <div class="reader-view" :class="{ 'focus-mode': focus, 'wide-reader': store.readerWidth === 'wide' }">
    <header class="reader-header"><div class="reader-header-left"><RouterLink to="/chapters" class="icon-button" aria-label="Вернуться к главам"><AppIcon name="arrowLeft" /></RouterLink><BrandMark compact /><span class="reader-header-divider"></span><div><span class="eyebrow">ИНФОРМАЦИОННЫЙ МИР</span><label class="reader-chapter-select"><select :value="chapterId" aria-label="Выбрать главу" @change="router.push(readerPath(Number($event.target.value)))"><option v-for="item in chapters" :key="item.id" :value="item.id">Глава {{ item.id }} — {{ item.title }}</option></select><AppIcon name="down" :size="14" /></label></div></div><div class="reader-header-actions"><button class="icon-button" :class="{ 'is-saved': bookmarked }" :aria-pressed="bookmarked" :aria-label="bookmarked ? 'Удалить закладку' : 'Добавить закладку'" title="Закладка (B)" @click="store.toggleBookmark(chapterId, page)"><AppIcon name="bookmark" :size="20" /></button><button class="icon-button width-button" :aria-pressed="store.readerWidth === 'wide'" aria-label="Переключить ширину страницы" title="Ширина страницы" @click="store.toggleWidth()"><AppIcon name="expand" :size="20" /></button><button class="icon-button" :aria-label="store.theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'" @click="store.toggleTheme()"><AppIcon :name="store.theme === 'dark' ? 'sun' : 'moon'" :size="20" /></button><button class="icon-button" aria-label="Скрыть панели" title="Режим погружения (F)" @click="focus = true"><AppIcon name="maximize" :size="20" /></button></div></header>
    <div class="reader-top-progress"><span :style="{ width: `${page / chapter.pages * 100}%` }"></span></div>
    <button v-if="focus" class="focus-exit button button-secondary" @click="focus = false"><AppIcon name="eye" :size="17" />Вернуть панели <kbd>F</kbd></button>
    <div class="reader-page-info"><span>ГЛАВА 0{{ chapterId }}<span class="text-muted"> / {{ chapter.title }}</span></span><span>СТРАНИЦА {{ String(page).padStart(2, '0') }} <span class="text-muted">/ {{ chapter.pages }}</span></span></div>
    <div class="reader-canvas" @touchstart.passive="touchStart = $event.touches.length === 1 ? { x: $event.touches[0].clientX, y: $event.touches[0].clientY } : null" @touchend.passive="touchEnd">
      <div v-if="loading && !imageError" class="page-loading" role="status"><span class="loading-spinner"></span><span>Открываем историю…</span></div>
      <div v-if="imageError" class="reader-image-error"><AppIcon name="book" :size="34" /><h2>Страница не загрузилась</h2><p>Попробуй открыть её ещё раз.</p><button class="button button-primary" @click="retry++; imageError = false; loading = true">Попробовать ещё раз</button></div>
      <img v-show="!imageError" :key="`${chapterId}:${page}:${retry}`" :src="pagePath(chapterId, page)" :alt="`Манга «Информационный мир», глава ${chapterId} «${chapter.title}», страница ${page}`" :class="{ loaded: !loading }" width="905" height="1280" fetchpriority="high" @load="loading = false" @error="imageError = true; loading = false" />
    </div>
    <div class="reader-hint"><span><kbd>←</kbd><kbd>→</kbd> листать</span><span><kbd>B</kbd> закладка</span><span><kbd>F</kbd> погружение</span><span class="mobile-swipe-hint">Листай кнопками или свайпом</span></div>
    <footer class="reader-bottom"><button class="reader-nav-button" :disabled="first" aria-label="Предыдущая страница" @click="move(-1)"><AppIcon name="arrowLeft" :size="19" /><span>Назад</span></button><div class="reader-page-controls"><label class="reader-page-select"><select :value="page" aria-label="Выбрать страницу" @change="jump($event.target.value)"><option v-for="number in chapter.pages" :key="number" :value="number">{{ number }} / {{ chapter.pages }}</option></select><AppIcon name="down" :size="14" /></label><input class="reader-range" type="range" min="1" :max="chapter.pages" :value="page" aria-label="Номер страницы" :aria-valuetext="`Страница ${page} из ${chapter.pages}`" @input="jump($event.target.value)" /></div><button class="reader-nav-button next" :aria-label="last ? 'Завершить чтение' : 'Следующая страница'" @click="move(1)"><span>{{ last ? 'Завершить' : 'Вперёд' }}</span><AppIcon :name="last ? 'check' : 'arrowRight'" :size="19" /></button></footer>
    <span class="sr-only" aria-live="polite">Глава {{ chapterId }}. Страница {{ page }} из {{ chapter.pages }}.</span>
  </div>
</template>
