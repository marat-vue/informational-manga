import { createRouter, createWebHashHistory } from 'vue-router'
import { validPosition } from './lib/progress'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('./pages/HomePage.vue'), meta: { title: 'Информационный мир — манга о цифровом мире' } },
    { path: '/chapters', name: 'chapters', component: () => import('./pages/ChaptersPage.vue'), meta: { title: 'Все главы — Информационный мир' } },
    { path: '/title', alias: '/about', name: 'about', component: () => import('./pages/AboutPage.vue'), meta: { title: 'О манге — Информационный мир' } },
    {
      path: '/chapter/:chapterId/page/:pageId', name: 'reader', component: () => import('./pages/ReaderPage.vue'),
      beforeEnter: (to) => validPosition(Number(to.params.chapterId), Number(to.params.pageId)) || '/chapters',
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/NotFoundPage.vue'), meta: { title: 'Страница не найдена — Информационный мир' } },
  ],
  scrollBehavior(to, from, saved) {
    if (to.name === 'reader' && from.name === 'reader') return { top: 0 }
    return saved || { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.name === 'reader' && !validPosition(Number(to.params.chapterId), Number(to.params.pageId))) return '/chapters'
  document.title = to.name === 'reader'
    ? `Глава ${to.params.chapterId} · Страница ${to.params.pageId} — Информационный мир`
    : to.meta.title
})

export default router
