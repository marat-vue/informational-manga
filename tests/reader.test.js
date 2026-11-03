import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { chapters, totalPages } from '../src/data/chapters.js'
import { adjacentPage, loadProgress, sanitizeProgress, validPosition, STORAGE_KEY } from '../src/lib/progress.js'

test('all 42 manga pages exist and chapter counts match the actual assets', () => {
  assert.equal(totalPages, 42)
  for (const chapter of chapters) {
    const directory = `public/images/chapters/chapter${chapter.id}`
    assert.equal(readdirSync(directory).filter((file) => /^page\d+\.jpg$/.test(file)).length, chapter.pages)
    for (let page = 1; page <= chapter.pages; page++) assert.ok(existsSync(`${directory}/page${page}.jpg`))
  }
})

test('reader crosses chapter boundaries in both directions without invalid positions', () => {
  assert.equal(adjacentPage(1, 1, -1), null)
  assert.equal(adjacentPage(4, 12, 1), null)
  for (let chapter = 1; chapter < 4; chapter++) {
    const end = chapters[chapter - 1].pages
    assert.deepEqual(adjacentPage(chapter, end, 1), { chapter: chapter + 1, page: 1 })
    assert.deepEqual(adjacentPage(chapter + 1, 1, -1), { chapter, page: end })
  }
  let position = { chapter: 1, page: 1 }, count = 1
  while ((position = adjacentPage(position.chapter, position.page, 1))) {
    assert.ok(validPosition(position.chapter, position.page)); count++
  }
  assert.equal(count, 42)
})

test('invalid URLs and corrupted saved state cannot create invalid reader positions', () => {
  for (const position of [[0, 1], [1, 0], [5, 1], [1, 12], [2, 11], [1.5, 1], [1, NaN], ['1', 1]]) assert.equal(validPosition(...position), false)
  const clean = sanitizeProgress({ last: { chapter: 7, page: 0 }, progress: { 1: 3, 2: 11, 9: 1 }, bookmarks: [null, { chapter: 1, page: 3 }, { chapter: 1, page: 3 }, { chapter: 4, page: 99 }], theme: 'unexpected', readerWidth: 'unexpected' })
  assert.equal(clean.last, null)
  assert.deepEqual(clean.progress, { 1: 3 })
  assert.deepEqual(clean.bookmarks, [{ chapter: 1, page: 3 }])
  assert.equal(clean.theme, 'dark')
  assert.equal(clean.readerWidth, 'comfortable')
})

test('progress from the original React build migrates and persisted state restores', () => {
  const legacy = { getItem: (key) => ({ lastChapter: '"2"', lastPage: '5' })[key] || null }
  assert.deepEqual(loadProgress(legacy).last, { chapter: 2, page: 5 })
  assert.deepEqual(loadProgress(legacy).progress, { 2: 5 })
  const value = { last: { chapter: 3, page: 7 }, progress: { 1: 11, 3: 7 }, bookmarks: [{ chapter: 1, page: 2 }], theme: 'light', readerWidth: 'wide' }
  assert.deepEqual(loadProgress({ getItem: (key) => key === STORAGE_KEY ? JSON.stringify(value) : null }), value)
})

test('unavailable storage and malformed JSON recover to a usable empty state', () => {
  assert.deepEqual(loadProgress({ getItem: () => { throw new Error('Storage blocked') } }), sanitizeProgress(null))
  assert.deepEqual(loadProgress({ getItem: () => '{invalid json' }), sanitizeProgress(null))
})
