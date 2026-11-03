import test from 'node:test'
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import { useReaderStore } from '../src/stores/reader.js'
import { STORAGE_KEY } from '../src/lib/progress.js'

function createStore(saved = {}) {
  const data = new Map(Object.entries(saved))
  globalThis.window = { localStorage: { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) } }
  setActivePinia(createPinia())
  return { store: useReaderStore(), data }
}

test('Pinia saves the actual first page of the next chapter and restores it after reload', () => {
  const { store, data } = createStore()
  store.visit(1, 11)
  store.visit(2, 1)
  assert.equal(store.continueTo, '/chapter/2/page/1')
  assert.equal(store.completed, 1)
  assert.equal(store.readPages, 12)
  const serialized = data.get(STORAGE_KEY)
  assert.deepEqual(JSON.parse(serialized).last, { chapter: 2, page: 1 })
  const { store: restored } = createStore({ [STORAGE_KEY]: serialized })
  assert.equal(restored.continueTo, '/chapter/2/page/1')
  restored.visit(1, 3)
  assert.equal(restored.continueTo, '/chapter/1/page/3')
  assert.equal(restored.progress[1], 11)
  restored.visit(8, 50)
  assert.equal(restored.continueTo, '/chapter/1/page/3')
})

test('bookmarks toggle per page, persist, and survive resetting reading progress', () => {
  const { store, data } = createStore()
  store.visit(1, 2)
  store.toggleBookmark(1, 2)
  store.toggleBookmark(2, 5)
  assert.equal(store.hasBookmark(1, 2), true)
  store.toggleBookmark(1, 2)
  assert.deepEqual(store.bookmarks, [{ chapter: 2, page: 5 }])
  store.resetProgress()
  assert.equal(store.continueTo, '/chapter/1/page/1')
  assert.equal(store.percentage, 0)
  assert.deepEqual(JSON.parse(data.get(STORAGE_KEY)).bookmarks, [{ chapter: 2, page: 5 }])
})

test('theme and reader width restore and restricted storage does not break reading', () => {
  const { store, data } = createStore()
  store.toggleTheme(); store.toggleWidth()
  const saved = JSON.parse(data.get(STORAGE_KEY))
  assert.equal(saved.theme, 'light'); assert.equal(saved.readerWidth, 'wide')
  window.localStorage.setItem = () => { throw new Error('Quota exceeded') }
  store.visit(3, 2)
  assert.equal(store.continueTo, '/chapter/3/page/2')
  assert.equal(store.storageAvailable, false)
  Object.defineProperty(window, 'localStorage', { get() { throw new Error('Access denied') } })
  setActivePinia(createPinia())
  const restricted = useReaderStore()
  assert.equal(restricted.continueTo, '/chapter/1/page/1')
  assert.equal(restricted.storageAvailable, false)
})
