import { chapters } from '../data/chapters.js'

export const STORAGE_KEY = 'information-world:v2'
const counts = chapters.map((chapter) => chapter.pages)

export function validPosition(chapter, page) {
  return Number.isInteger(chapter) && Number.isInteger(page) && chapter >= 1 && chapter <= counts.length && page >= 1 && page <= counts[chapter - 1]
}

export function adjacentPage(chapter, page, direction) {
  if (!validPosition(chapter, page) || ![-1, 1].includes(direction)) return null
  if (direction === 1) {
    if (page < counts[chapter - 1]) return { chapter, page: page + 1 }
    return chapter < counts.length ? { chapter: chapter + 1, page: 1 } : null
  }
  if (page > 1) return { chapter, page: page - 1 }
  return chapter > 1 ? { chapter: chapter - 1, page: counts[chapter - 2] } : null
}

export function sanitizeProgress(value) {
  const result = { last: null, progress: {}, bookmarks: [], theme: 'dark', readerWidth: 'comfortable' }
  if (!value || typeof value !== 'object') return result
  if (validPosition(value.last?.chapter, value.last?.page)) result.last = { chapter: value.last.chapter, page: value.last.page }
  for (const [chapter, page] of Object.entries(value.progress || {})) {
    if (validPosition(Number(chapter), page)) result.progress[chapter] = page
  }
  if (Array.isArray(value.bookmarks)) {
    const seen = new Set()
    result.bookmarks = value.bookmarks.filter((item) => {
      if (!validPosition(item?.chapter, item?.page)) return false
      const key = `${item.chapter}:${item.page}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).map(({ chapter, page }) => ({ chapter, page }))
  }
  if (value.theme === 'light') result.theme = 'light'
  if (value.readerWidth === 'wide') result.readerWidth = 'wide'
  return result
}

export function loadProgress(storage) {
  try {
    const saved = storage.getItem(STORAGE_KEY)
    if (saved) return sanitizeProgress(JSON.parse(saved))
    const chapter = Number(JSON.parse(storage.getItem('lastChapter')))
    const page = Number(JSON.parse(storage.getItem('lastPage')))
    return sanitizeProgress(validPosition(chapter, page) ? { last: { chapter, page }, progress: { [chapter]: page } } : null)
  } catch {
    return sanitizeProgress(null)
  }
}
