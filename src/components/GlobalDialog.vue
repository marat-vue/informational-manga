<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import { chapters, pagePath, readerPath, totalPages } from '../data/chapters'
import { useReaderStore } from '../stores/reader'
const store = useReaderStore()
const dialog = ref(null)
const searchInput = ref(null)
const query = ref('')
const confirmReset = ref(false)
const results = computed(() => chapters.filter((chapter) => `${chapter.title} ${chapter.topic} ${chapter.summary}`.toLowerCase().includes(query.value.trim().toLowerCase())))
watch(() => store.modal, async (modal) => {
  if (modal) {
    query.value = ''; confirmReset.value = false
    if (!dialog.value.open) dialog.value.showModal()
    document.body.style.overflow = 'hidden'
    await nextTick()
    if (modal === 'search') searchInput.value?.focus()
  } else { dialog.value?.close(); document.body.style.overflow = '' }
})
function close() { store.modal = null }
function backdrop(event) { if (event.target === dialog.value) { const rect = dialog.value.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close() } }
</script>

<template>
  <dialog ref="dialog" class="global-dialog" aria-labelledby="dialog-heading" @cancel.prevent="close" @close="close" @click="backdrop">
    <div class="dialog-heading"><div><span class="eyebrow">ТВОЙ ИНФОРМАЦИОННЫЙ МИР</span><h2 id="dialog-heading">{{ store.modal === 'search' ? 'Найди свою главу' : 'Моя библиотека' }}</h2></div><button class="icon-button" aria-label="Закрыть" @click="close"><AppIcon name="close" /></button></div>
    <template v-if="store.modal === 'search'">
      <label class="search-field"><AppIcon name="search" /><input ref="searchInput" v-model="query" placeholder="Название, тема или ключевое слово…" aria-label="Поиск глав" /><kbd>ESC</kbd></label>
      <p class="dialog-caption">{{ query ? `Найдено глав: ${results.length}` : 'Все четыре истории — в одном месте' }}</p>
      <div class="dialog-chapter-list"><RouterLink v-for="chapter in results" :key="chapter.id" :to="readerPath(chapter.id)" class="search-result" @click="close"><span class="result-number">0{{ chapter.id }}</span><span><strong>{{ chapter.title }}</strong><small>{{ chapter.topic }} · {{ chapter.pages }} страниц</small></span><AppIcon name="arrowUpRight" /></RouterLink></div>
      <div v-if="!results.length" class="empty-state"><AppIcon name="search" :size="34" /><h3>Пока ничего не нашлось</h3><p>Попробуй «пароли», «сети» или «технологии».</p><button class="text-link" @click="query = ''">Показать все главы <AppIcon name="arrowRight" :size="16" /></button></div>
    </template>
    <template v-else-if="store.modal === 'library'">
      <div class="library-progress"><div class="flex items-center justify-between"><span>Твой путь по истории</span><strong>{{ store.percentage }}%</strong></div><div class="progress-track"><span :style="{ width: `${store.percentage}%` }"></span></div><small>{{ store.readPages }} из {{ totalPages }} страниц · {{ store.completed }} из 4 глав прочитано</small><RouterLink :to="store.continueTo" class="button button-primary mt-5" @click="close"><AppIcon name="book" :size="17" />{{ store.last ? 'Продолжить чтение' : 'Начать историю' }}<AppIcon name="arrowRight" :size="17" /></RouterLink></div>
      <h3 class="bookmarks-heading">Закладки <span>{{ store.bookmarks.length }}</span></h3>
      <div v-if="store.bookmarks.length" class="bookmark-list"><div v-for="item in store.bookmarks" :key="`${item.chapter}:${item.page}`" class="bookmark-row"><RouterLink :to="readerPath(item.chapter, item.page)" @click="close"><img :src="pagePath(item.chapter, item.page)" alt="" /><span><strong>{{ chapters[item.chapter - 1].title }}</strong><small>Глава {{ item.chapter }} · Страница {{ item.page }}</small></span><AppIcon name="arrowUpRight" :size="18" /></RouterLink><button class="icon-button" :aria-label="`Удалить закладку: глава ${item.chapter}, страница ${item.page}`" @click="store.toggleBookmark(item.chapter, item.page)"><AppIcon name="close" :size="16" /></button></div></div>
      <div v-else class="empty-state compact"><AppIcon name="bookmark" :size="30" /><h3>Самые важные моменты — здесь</h3><p>Нажми на значок закладки во время чтения,<br />чтобы вернуться к любимой странице.</p></div>
      <p class="storage-note">{{ store.storageAvailable ? 'Прогресс и закладки сохраняются в этом браузере.' : 'Браузер запретил сохранение. Прогресс доступен до закрытия страницы.' }}</p>
      <div v-if="store.last" class="reset-area"><button v-if="!confirmReset" class="muted-button" @click="confirmReset = true"><AppIcon name="reset" :size="13" />Сбросить прогресс</button><div v-else class="reset-confirm"><span>Начать отсчёт заново?</span><button class="text-accent" @click="store.resetProgress(); confirmReset = false">Сбросить</button><button @click="confirmReset = false">Отмена</button></div></div>
    </template>
  </dialog>
</template>
