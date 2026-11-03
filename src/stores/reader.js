import { defineStore } from 'pinia'
import { STORAGE_KEY, loadProgress, sanitizeProgress, validPosition } from '../lib/progress.js'
import { chapters, readerPath, totalPages } from '../data/chapters.js'

function initialState() {
  try { return { ...loadProgress(window.localStorage), storageAvailable: true } }
  catch { return { ...sanitizeProgress(null), storageAvailable: false } }
}

export const useReaderStore = defineStore('reader', {
  state: () => ({ ...initialState(), modal: null, toast: '' }),
  getters: {
    continueTo: (state) => state.last ? readerPath(state.last.chapter, state.last.page) : readerPath(1),
    readPages: (state) => Object.values(state.progress).reduce((sum, page) => sum + page, 0),
    percentage() { return Math.round(this.readPages / totalPages * 100) },
    completed: (state) => chapters.filter((chapter) => state.progress[chapter.id] === chapter.pages).length,
  },
  actions: {
    save() {
      try {
        const { last, progress, bookmarks, theme, readerWidth } = this
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ last, progress, bookmarks, theme, readerWidth }))
      } catch { this.storageAvailable = false }
    },
    visit(chapter, page) {
      if (!validPosition(chapter, page)) return
      this.last = { chapter, page }
      this.progress[chapter] = Math.max(this.progress[chapter] || 0, page)
      this.save()
    },
    hasBookmark(chapter, page) { return this.bookmarks.some((item) => item.chapter === chapter && item.page === page) },
    toggleBookmark(chapter, page) {
      if (!validPosition(chapter, page)) return
      if (this.hasBookmark(chapter, page)) {
        this.bookmarks = this.bookmarks.filter((item) => item.chapter !== chapter || item.page !== page)
        this.notify('Закладка удалена')
      } else {
        this.bookmarks.unshift({ chapter, page })
        this.notify('Страница сохранена в закладки')
      }
      this.save()
    },
    toggleTheme() { this.theme = this.theme === 'dark' ? 'light' : 'dark'; this.save() },
    toggleWidth() { this.readerWidth = this.readerWidth === 'comfortable' ? 'wide' : 'comfortable'; this.save() },
    notify(message) { this.toast = message },
    resetProgress() { this.last = null; this.progress = {}; this.save(); this.notify('Прогресс чтения сброшен') },
  },
})
