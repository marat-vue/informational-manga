<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BrandMark from './components/BrandMark.vue'
import AppIcon from './components/AppIcon.vue'
import GlobalDialog from './components/GlobalDialog.vue'
import { useReaderStore } from './stores/reader'
const store = useReaderStore()
const route = useRoute()
const menuOpen = ref(false)
const reader = computed(() => route.name === 'reader')
let toastTimer
watch(() => store.toast, (value) => { clearTimeout(toastTimer); if (value) toastTimer = setTimeout(() => { store.toast = '' }, 3200) })
watch(() => store.theme, (theme) => { document.documentElement.dataset.theme = theme; document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#111214' : '#f5f3ef' }, { immediate: true })
watch(() => route.fullPath, () => { menuOpen.value = false; store.modal = null })
function shortcut(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); store.modal = store.modal === 'search' ? null : 'search' }
}
function skipToMain() { const main = document.getElementById('main'); main.focus(); main.scrollIntoView() }
onMounted(() => window.addEventListener('keydown', shortcut))
onUnmounted(() => { window.removeEventListener('keydown', shortcut); clearTimeout(toastTimer) })
</script>

<template>
  <a class="skip-link" href="#main" @click.prevent="skipToMain">Перейти к содержимому</a>
  <header v-if="!reader" class="site-header">
    <div class="header-inner shell">
      <BrandMark />
      <nav class="desktop-nav" aria-label="Основная навигация">
        <RouterLink to="/" exact-active-class="active">Главная</RouterLink>
        <RouterLink to="/chapters" active-class="active">Главы <span class="nav-count">04</span></RouterLink>
        <RouterLink to="/title" active-class="active">О манге</RouterLink>
      </nav>
      <div class="header-actions">
        <button class="icon-button search-trigger" aria-label="Поиск по главам" title="Поиск (Ctrl+K)" @click="store.modal = 'search'"><AppIcon name="search" /></button>
        <button class="icon-button theme-trigger" :aria-label="store.theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'" @click="store.toggleTheme()"><AppIcon :name="store.theme === 'dark' ? 'sun' : 'moon'" /></button>
        <span class="action-divider"></span>
        <button class="library-button" @click="store.modal = 'library'"><AppIcon name="bookmark" :size="17" /><span>Моя библиотека</span><span v-if="store.bookmarks.length" class="bookmark-count">{{ store.bookmarks.length }}</span></button>
        <button class="icon-button mobile-menu-button" :aria-expanded="menuOpen" aria-label="Открыть меню" @click="menuOpen = !menuOpen"><AppIcon :name="menuOpen ? 'close' : 'menu'" /></button>
      </div>
    </div>
    <nav v-if="menuOpen" class="mobile-nav shell" aria-label="Мобильная навигация"><RouterLink to="/">Главная</RouterLink><RouterLink to="/chapters">Все главы</RouterLink><RouterLink to="/title">О манге</RouterLink></nav>
  </header>

  <main id="main" tabindex="-1" :class="{ 'reader-main': reader }">
    <RouterView v-slot="{ Component, route: current }"><Transition name="page" mode="out-in"><component :is="Component" :key="current.name" /></Transition></RouterView>
  </main>

  <footer v-if="!reader" class="site-footer shell">
    <div class="footer-main"><BrandMark /><p>История, которая делает<br />цифровой мир понятнее.</p><div class="footer-links"><RouterLink to="/chapters">Читать мангу <AppIcon name="arrowUpRight" :size="15" /></RouterLink><RouterLink to="/title">О проекте</RouterLink></div><span class="footer-japanese" lang="ja">情報の世界</span></div>
    <div class="footer-bottom"><span>© {{ new Date().getFullYear() }} Информационный мир</span><span>Создано с любовью к историям <AppIcon name="heart" :size="12" /></span><span class="footer-age">12+</span></div>
  </footer>
  <GlobalDialog />
  <Transition name="toast"><div v-if="store.toast" role="status" class="toast-message"><AppIcon name="check" :size="17" />{{ store.toast }}</div></Transition>
</template>
